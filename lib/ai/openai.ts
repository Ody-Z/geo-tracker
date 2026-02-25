import OpenAI from "openai";
import { AI_MODELS } from "./models";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function queryOpenAI(prompt: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: AI_MODELS.openai.id,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}
