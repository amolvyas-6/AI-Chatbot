import express from "express";
import * as chatbot from "../controllers/chatbot.js";

const router = express.Router();

router.get("/", chatbot.getResponseFromChatbot);

export default router;
