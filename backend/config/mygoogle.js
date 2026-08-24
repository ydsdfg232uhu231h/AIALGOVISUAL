import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();
export const ai = new GoogleGenAI({
  apiKey: `${process.env.GEMINI_API_KEY}`,
});

export const DEFAULT_MODEL = "gemini-3.5-flash-lite";