import { Router } from "express";
import { userswelcome } from "../controller/user.controller.js";
import authRouter from "./auth.routes.js";
import chatsRoutes from "./chat.routes.js";
import dsaproblemroute from "./dsaproblem.routes.js";

const mrouter = Router();



mrouter.get("/home",userswelcome);
mrouter.use("/auth", authRouter); // /auth/login or /auth/signup
mrouter.use("/chat", chatsRoutes); // /chat/new
mrouter.use('/dsa', dsaproblemroute); // /dsa/prob
export default mrouter;
