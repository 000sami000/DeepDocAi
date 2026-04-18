import { User } from "./entities/user.entity.js";

export interface ChunkPayload {
  chunkId: string;
  content: string;
  order: number;

  pageNumber: number;
  chunkIndexInPage: number;

  documentId: string;
  chatId?: string;

  embedding?: number[];
}
export interface PageChunkResult {
  pageNumber: number;
  text: string;
  chunks: ChunkPayload[];
}
 
export interface CreateChatResponse {
  status: "ok" | "error";
  message: string;
  jobId?: string;
  chunksCount?: number;
}

export const QUEUE_TYPES = {
  CHUNK_PROCESS: "process-chunks",
  DOCUMENT: "process-document",
  DELETE_CHAT : "delete_chat",
  
} as const;



declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}