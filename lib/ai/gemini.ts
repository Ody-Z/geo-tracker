import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_MODELS } from "./models";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY!
);

export async function queryGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: AI_MODELS.gemini.id });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
