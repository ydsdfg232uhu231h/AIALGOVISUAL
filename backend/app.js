import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import mrouter from "../backend/routes/index.routes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
const __firstname = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__firstname)
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use("/api/v1/",mrouter);
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

export default app;