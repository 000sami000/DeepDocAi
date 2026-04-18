
import { QdrantClient } from "@qdrant/js-client-rest";

import { v4 as uuidv4 } from "uuid";
const globalForQdrant = globalThis as unknown as {
  qdrant?: QdrantClient;
};

export const qdrant =
  globalForQdrant.qdrant ??
  new QdrantClient({
    url: process.env.QDRANT_URL ,
  });

if (!globalForQdrant.qdrant) {
  globalForQdrant.qdrant = qdrant;
}




const COLLECTION_NAME = "documents";

let initialized = false; 

export async function initQdrant() {
  if (initialized) return; 

  try {
    const { collections } = await qdrant.getCollections();

    const exists = collections.some(
      (c) => c.name === COLLECTION_NAME
    );

    if (!exists) {
      await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 768,
          distance: "Cosine",
        },
      });

      console.log("Qdrant collection created");
    } else {
      console.log("Collection already exists");
    }

    initialized = true;
  } catch (err) {
    console.error("Qdrant init failed:", err);
    throw err; 
  }
}


export async function storeInQdrant(chunks: {
  content: string;
  embedding: number[];
  pageNumber: number;
  chunkIndexInPage: number;
  documentId: string;
  chatId?: string;
}[]) {
  try {
    const points = chunks.map((chunk) => ({
      id: uuidv4(),
      vector: chunk.embedding,
      payload: {
        content: chunk.content,
        pageNumber: chunk.pageNumber,
        chunkIndexInPage: chunk.chunkIndexInPage,
        documentId: chunk.documentId,
        chatId: chunk.chatId,
      },
    }));

    await qdrant.upsert("documents", {
      points,
      wait: true,
    });

    console.log(`Upserted ${points.length} chunks`);

    return points; 
  } catch (err) {
    console.error("Failed to store chunks in Qdrant:", err);
    throw err;
  }
}

export async function deleteChatFromQdrant(chatId: string) {
  try {
    await qdrant.delete("documents", {
      filter: {
        must: [
          {
            key: "chatId",
            match: {
              value: chatId,
            },
          },
        ],
      },
    });

    console.log(`Qdrant deleted for chatId: ${chatId}`);
  } catch (err) {
    console.error("Qdrant delete failed:", err);
    throw err;
  }
}