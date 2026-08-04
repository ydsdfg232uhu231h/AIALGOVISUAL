import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import mrouter from "../backend/routes/index.routes.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use("/api/v1/",mrouter);

export default app;