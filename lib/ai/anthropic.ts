import Anthropic from "@anthropic-ai/sdk";
import { AI_MODELS } from "./models";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function queryAnthropic(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: AI_MODELS.anthropic.id,
    max_tokens: 2048,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{ role: "user", content: prompt }],
  });

  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}
