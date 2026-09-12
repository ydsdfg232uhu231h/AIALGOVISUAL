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
const __dirname = path.dirname(__firstname);
const distPath = path.join(__dirname, "..", "client", "dist");
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({ origin : "https://aialgovisual-1.onrender.com",
  credentials: true
    }));
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use("/api/v1/",mrouter);
app.use(express.static(path.join(__dirname, "../client" ,"dist")));

app.get(/^(?!\/api\/v1).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.js"));
});

export default app;