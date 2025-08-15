import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "assisstant", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export const Message = mongoose.model("Message", messageSchema);
