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
      required: true, // Fixed spelling typo from "reqired"
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
      sparse: true, // Allows null/missing handles without breaking unique index
      trim: true,
    },
    customAvatar: {
      type: String,
      default: "",
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
  {
    timestamps: true, // Recommended: adds createdAt and updatedAt fields automatically
  }
);


export default mongoose.model("User", userSchema);