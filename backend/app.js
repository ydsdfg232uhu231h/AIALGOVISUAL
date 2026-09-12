import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import mrouter from "../backend/routes/index.routes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
const allowedOrigins = [
  "https://aafpsw.netlify.app",
  "https://legendary-puffpuff-21085c.netlify.app",
  "http://localhost:5173", // Local Vite
  "http://localhost:5000"  // Local React/Node
];
const __firstname = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__firstname);
const distPath = path.join(__dirname, "..", "client", "dist");
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Enable if sending cookies/authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use("/api/v1/",mrouter);
app.use(express.static(path.join(__dirname, "../client" ,"dist")));

app.get(/^(?!\/api\/v1).*/, (req, res) => {
  res.sendFile(distPath);
});

export default app;