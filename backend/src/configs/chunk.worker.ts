import { Worker, Job } from "bullmq";

import { extractAndChunkPDF } from "../utils/chunks.js";
import { createEmbeddings } from "./embeddings.js";
import { storeInQdrant } from "./qdrant.js";
import { QUEUE_TYPES } from "../types.js";
import { getDataSource } from "../lib/data-source.js";
import { Chat } from "../entities/chat.entity.js";
import { User } from "../entities/user.entity.js";
import { Chunk } from "../entities/chunk.entity.js";

interface JobData {
  bufferData: Buffer;
  fileName: string;
  userId: string;
}

// if (!dataSource.isInitialized) {
//   await dataSource.initialize();
// }
console.log("Chunks Worker initialized  ...");
const worker = new Worker(
  QUEUE_TYPES.CHUNK_PROCESS,
  async (job: Job) => {
    try {
      console.log(" Worker started ");

      const { bufferData, fileName, userId } = job.data as JobData;

      // console.log("Job received:",bufferData);
      const buffer = Buffer.from(job.data.bufferData, "base64");
      const chunks = await extractAndChunkPDF(buffer);

      // console.log("Chunks created:", chunks.length);
      // console.log("Chunks list:", chunks);

      const dataSource = await getDataSource();
      const chatRepo = dataSource.getRepository(Chat);
      const chat = chatRepo.create({
        name: (fileName.split("/").pop() || "").replace(/\.pdf$/i, "").slice(0, 15),
        user_id: Number(userId),
      });

      await chatRepo.save(chat);

      const chatId = chat.chat_id;
      const chunksWithEmbeddings = await createEmbeddings(chunks, chatId);

      const points = await storeInQdrant(chunksWithEmbeddings);

      // const userRepo = dataSource.getRepository(User);
      const chunkRepo = dataSource.getRepository(Chunk);

      const chunkEntities = chunksWithEmbeddings.map((c, i) =>
        chunkRepo.create({
          chunk_content: c.content,
          qdrant_point_id: points[i].id,
        }),
      );

      await chunkRepo.save(chunkEntities);

      console.log("Chat created with ID:", chat.chat_id);

      return chunks;
    } catch (err) {
      console.error("Worker error:", err);
      throw err;
    }
  },
  {
    connection: {
      host: process.env.BULL_MQ_REDIS_HOST,
      port: parseInt(process.env.BULL_MQ_REDIS_PORT as string),
    },
  },
);


worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`💥 Job ${job?.id} failed:`, err);
});
