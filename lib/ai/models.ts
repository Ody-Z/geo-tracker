export const AI_MODELS = {
  openai: {
    id: "gpt-4o-mini",
    name: "ChatGPT",
    weight: 1.0,
    color: "#10B981",
  },
  anthropic: {
    id: "claude-haiku-4-5-20251001",
    name: "Claude",
    weight: 1.0,
    color: "#F59E0B",
  },
  perplexity: {
    id: "sonar",
    name: "Perplexity",
    weight: 1.2,
    color: "#6366F1",
  },
  gemini: {
    id: "gemini-2.0-flash-lite",
    name: "Gemini",
    weight: 1.0,
    color: "#3B82F6",
  },
} as const;

export type ModelKey = keyof typeof AI_MODELS;
export const MODEL_KEYS = Object.keys(AI_MODELS) as ModelKey[];
