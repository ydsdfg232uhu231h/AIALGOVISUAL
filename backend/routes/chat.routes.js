import { Router } from "express";
import { deleteChats, generateChatCompletion, sendChattoUser } from "../controller/chat.controller.js";
import { verifyToken } from "../util/token.js";
import { chatCompletionValidator, validate } from "../util/validation.js";
const chatsRoutes = Router();

chatsRoutes.post(
    "/new",
    validate(chatCompletionValidator), 
    verifyToken, 
    generateChatCompletion
);
chatsRoutes.get("/all-chats", verifyToken,sendChattoUser);
chatsRoutes.delete("/delete", verifyToken,deleteChats)
export default chatsRoutes;