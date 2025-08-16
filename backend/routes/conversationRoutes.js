import { Router } from "express";
import {
  newConversation,
  addMessage,
  getAllConversations,
  getAllMessagesFromConversation,
  deleteConversation,
} from "../controllers/conversationController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, newConversation)
  .get(verifyJWT, getAllConversations);

router
  .route("/:conversationId")
  .post(verifyJWT, addMessage)
  .get(verifyJWT, getAllMessagesFromConversation)
  .delete(verifyJWT, deleteConversation);

export default router;
