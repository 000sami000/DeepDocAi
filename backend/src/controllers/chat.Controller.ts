import { Request, Response } from "express";

import { getQueue } from "../configs/queue.js";
import { ChunkPayload, CreateChatResponse, QUEUE_TYPES } from "../types.js";
import { getDataSource } from "../lib/data-source.js";
import { Chat } from "../entities/chat.entity.js";
import { deleteChatFromQdrant } from "../configs/qdrant.js";

export const createChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized: User not authenticated.",
      } as CreateChatResponse);
      return;
    }

    if (!req.file) {
      res.status(400).json({
        status: "error",
        message: "No file provided",
      } as CreateChatResponse);
      return;
    }

    const { filename, buffer } = req.file;

    console.log("File received:", filename);

    const job = await getQueue(QUEUE_TYPES.CHUNK_PROCESS).add(
      QUEUE_TYPES.CHUNK_PROCESS,
      {
        bufferData: buffer.toString("base64"),
        fileName: filename,
        userId: req.user.user_id,
      }
    );

    res.status(201).json({
      status: "ok",
      message: "Chat processing started",
      jobId: job.id,
    } as CreateChatResponse);

    return;

  } catch (err) {
    console.error("Unexpected error in createChat:", err);

    res.status(500).json({
      status: "error",
      message: err instanceof Error ? err.message : "Failed to create chat",
    } as CreateChatResponse);

    return;
  }
};

export const getChats = async (req: any, res: Response) => {
  
   const dataSource = await getDataSource();
  const chatRepo = dataSource.getRepository(Chat);

  const chats = await chatRepo.find({
    where: {
      user: {
        user_id: req.user.user_id,
      },
      isDeleted: false,
      
    },
    order: {
      createdAt: "DESC",
    },
  });

  res.json({ chats });
};



export const getChatById = async (req: Request, res: Response) => {
  try {
    const chatIdParam = req.params.chatId;

    if (!chatIdParam || Array.isArray(chatIdParam)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    const user = (req as any).user;
 
     const dataSource = await getDataSource();
    const chatRepo = dataSource.getRepository(Chat);

    const chat = await chatRepo.findOne({
      where: {
        chat_id: chatIdParam,
        user: {
          user_id: user.user_id,
          
        },
        isDeleted: false,
      },
      relations: ["messages"],
      order: {
        messages: {
          createdAt: "ASC",
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({
      success: true,
      chat,
    });

  } catch (error: any) {
    console.error("Error fetching chat:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



export const deleteChat = async (req: any, res: any) => {
  const chatId = req.params.chatId;
  const userId = req.user.user_id;

  try {

     const dataSource = await getDataSource();
    const chatRepo = dataSource.getRepository(Chat);

    const chat = await chatRepo.findOne({
      where: {
        chat_id: chatId,
        user: { user_id: userId },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    
    chat.isDeleted = true;
    await chatRepo.save(chat);


    await getQueue(QUEUE_TYPES.DELETE_CHAT).add(
      QUEUE_TYPES.DELETE_CHAT,
      { chatId },
      {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Chat marked for deletion",
    });

  } catch (err: any) {
    return res.status(500).json({
      message: "Delete failed",
      error: err.message,
    });
  }
};