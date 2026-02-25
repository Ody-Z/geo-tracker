import { AI_MODELS } from "./models";

interface PerplexityResponse {
  choices: { message: { content: string } }[];
  citations?: string[];
}

export async function queryPerplexity(
  prompt: string
): Promise<{ text: string; citations: string[] }> {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_MODELS.perplexity.id,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data: PerplexityResponse = await response.json();

  return {
    text: data.choices[0]?.message?.content || "",
    citations: data.citations || [],
  };
}
