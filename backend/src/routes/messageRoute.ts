
import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.Controller.js";


const router = express.Router();


router.post('/', authMiddleware,sendMessage);
router.get("/:chatId", authMiddleware, getMessages);

export default router;