import { ai } from "../lib/gemini.js";
import { ChunkPayload } from "../types.js";

export async function createEmbeddings(
  chunks: ChunkPayload[],
  chatId: string
) {
  const batchSize = 50;

  const batches: ChunkPayload[][] = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    batches.push(chunks.slice(i, i + batchSize));
  }

  const responses = await Promise.all(
    batches.map((batch) =>
      ai.models.embedContent({
        model: process.env.EMBEDDING_MODEL_ID as string,
        contents: batch.map((c) => c.content),
        config: { outputDimensionality: 768 },
      })
    )
  );

  const enriched: (ChunkPayload & { embedding: number[] })[] = [];

  let chunkIndex = 0;

  for (const res of responses) {
    if (!res.embeddings) {
      throw new Error("No embeddings returned");
    }

    for (const emb of res.embeddings) {
      if (emb.values) {
        enriched.push({
          ...chunks[chunkIndex],
          embedding: emb.values,
          chatId,
        });
      }

      chunkIndex++;
    }
  }
    //  console.log("Embeddings created:", enriched);
  return enriched;
}