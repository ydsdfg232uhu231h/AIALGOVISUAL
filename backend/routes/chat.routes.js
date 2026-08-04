import { Router } from "express";
import { generateChatCompletion } from "../controller/chat.controller.js";
import { verifyToken } from "../util/token.js";
import { chatCompletionValidator, validate } from "../util/validation.js";
const chatsRoutes = Router();

chatsRoutes.post(
    "/new",
    validate(chatCompletionValidator), 
    verifyToken, 
    generateChatCompletion
);
export default chatsRoutes;