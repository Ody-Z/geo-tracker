import { GoogleGenerativeAI, type Tool } from "@google/generative-ai";
import { AI_MODELS } from "./models";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY!
);

const MAX_RETRIES = 4;
const INITIAL_BACKOFF_MS = 2000;

export async function queryGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: AI_MODELS.gemini.id,
    tools: [{ googleSearch: {} } as Tool],
  });

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: unknown) {
      lastError = err;
      const is429 =
        err &&
        typeof err === "object" &&
        "status" in err &&
        (err as { status?: number }).status === 429;
      const msg = err instanceof Error ? err.message : String(err);
      const isRateLimit = is429 || /429|quota|rate limit/i.test(msg);

      if (!isRateLimit || attempt === MAX_RETRIES) throw err;

      const retryAfter =
        err &&
        typeof err === "object" &&
        "headers" in err &&
        typeof (err as { headers?: { get?: (n: string) => string } }).headers?.get === "function"
          ? parseInt((err as { headers: { get: (n: string) => string } }).headers.get("retry-after") || "0", 10)
          : 0;
      const delayMs =
        retryAfter > 0 ? retryAfter * 1000 : INITIAL_BACKOFF_MS * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastError;
}
