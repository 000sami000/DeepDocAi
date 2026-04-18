
import express from "express";
import { parseFileUpload } from "../middleware/file-upload.middleware.js";
import { createChat, deleteChat, getChatById, getChats } from "../controllers/chat.Controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post('/', authMiddleware,parseFileUpload(50 * 1024 * 1024),createChat);
router.get("/", authMiddleware, getChats);
router.get("/:chatId", authMiddleware, getChatById);
router.delete("/:chatId", authMiddleware, deleteChat);
export default router;