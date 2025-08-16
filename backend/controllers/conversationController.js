import { Conversation } from "../models/conversationModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/messageModel.js";
import axios from "axios";

const newConversation = asyncHandler(async (req, res) => {
  // Get User ID of the User
  const userId = req.user._id;

  // Create Title and add to DB
  const title = "<Sample Title>"; // TODO: add dynamic title
  const conversation = await Conversation.create({
    userId,
    title,
  });

  res.send(new ApiResponse(200, conversation));
});

const addMessage = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;
  const { content, role } = req.body;

  if (!conversationId) {
    throw new ApiError(400, "Conversation ID is required");
  }
  if (!content || !role) {
    throw new ApiError(400, "Content or role of message is missing");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const userMessage = await Message.create({
    conversationId,
    role,
    content,
  });

  const chatHistory = await Message.find({ conversationId })
    .sort({
      createdAt: -1,
    })
    .limit(10)
    .select("-_id -conversationId -createdAt -updatedAt -__v");

  chatHistory.reverse();

  // const aiResponse = await axios.get("http://localhost:5000/api/ai", {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: {
  //     messages: chatHistory,
  //   },
  // });

  const aiMessage = await Message.create({
    conversationId: userMessage.conversationId,
    role: "assistant",
    content: "TEsting", // aiResponse.data.content,
  });

  res.send(new ApiResponse(200, aiMessage));
});

const getAllConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const conversations = await Conversation.find({ userId }).sort({
    createdAt: -1,
  });
  console.log(conversations);
  res.send(new ApiResponse(200, conversations));
});

const getAllMessagesFromConversation = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;

  if (!conversationId) {
    throw new ApiError(400, "Conversation ID is required");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const messages = await Message.find({ conversationId }).sort({
    createdAt: 1,
  });
  res.send(new ApiResponse(200, messages));
});

const deleteConversation = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }
  await Conversation.deleteMany({ _id: conversationId });
  res.send(new ApiResponse(200, "Conversation deleted successfully"));
});

export {
  newConversation,
  addMessage,
  getAllConversations,
  getAllMessagesFromConversation,
  deleteConversation,
};
