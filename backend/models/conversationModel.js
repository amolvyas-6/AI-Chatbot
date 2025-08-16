import mongoose from "mongoose";
import { Message } from "./messageModel.js";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
  },
  { timestamps: true }
);

conversationSchema.post("deleteMany", async function (doc, next) {
  console.log(next);
  await Message.deleteMany({ conversationId: doc._id });
  next();
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
