import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured in the backend environment variables.');
  }
  return new GoogleGenAI({ apiKey });
}
