import { Worker, Job } from "bullmq";
import { getDataSource } from "../lib/data-source.js";
import { Chat } from "../entities/chat.entity.js";
import { deleteChatFromQdrant } from "../configs/qdrant.js";
import { QUEUE_TYPES } from "../types.js";


console.log("Delete Chat Worker initialized  ...");
const worker = new Worker(
  QUEUE_TYPES.DELETE_CHAT,
  async (job: Job) => {
    const { chatId } = job.data;

    console.log(" Worker processing delete for:", chatId);

    
    await deleteChatFromQdrant(chatId);

   const dataSource = await getDataSource();
    const chatRepo =  dataSource.getRepository(Chat);

    await chatRepo.delete({ chat_id: chatId });

    console.log("Fully deleted chat:", chatId);
  },
  {
    connection: {
      host: process.env.BULL_MQ_REDIS_HOST || "localhost",
      port: parseInt(process.env.BULL_MQ_REDIS_PORT as string) || 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Delete job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Delete job ${job?.id} failed:`, err);
});