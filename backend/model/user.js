import mongoose from "mongoose";
import {randomUUID} from "node:crypto";


const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID()

    },
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    handle: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    
    customAvatar: {
      url: { type: String, default: "" },
      fileData: { type: Buffer },
      contentType: { type: String },
    },
    bio: {
      type: String,
      default: "",
      maxLength: 500,
    },
    targetGoal: {
      type: String,
      default: "",
    },
    chats: [chatSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);