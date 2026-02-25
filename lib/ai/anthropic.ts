import Anthropic from "@anthropic-ai/sdk";
import { AI_MODELS } from "./models";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function queryAnthropic(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: AI_MODELS.anthropic.id,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}
