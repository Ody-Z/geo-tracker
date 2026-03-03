import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function parseQueryGeneratorContent(content: string): string[] {
  const jsonSource = content.startsWith("[") || content.startsWith("{") ? content : `{${content}}`;
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonSource);
  } catch {
    const arrayMatch = content.match(/\[[\s\S]*\]/);
    parsed = arrayMatch ? JSON.parse(arrayMatch[0]) : {};
  }

  let raw: unknown[] = [];
  if (Array.isArray(parsed)) {
    raw = parsed;
  } else if (parsed && typeof parsed === "object") {
    if ("queries" in parsed && Array.isArray((parsed as { queries: unknown[] }).queries)) {
      raw = (parsed as { queries: unknown[] }).queries;
    } else if ("items" in parsed && Array.isArray((parsed as { items: unknown[] }).items)) {
      raw = (parsed as { items: unknown[] }).items;
    } else {
      const arr = Object.values(parsed).find((v) => Array.isArray(v));
      if (Array.isArray(arr)) {
        raw = arr;
      } else if (Object.values(parsed).every((v) => typeof v === "string")) {
        raw = Object.values(parsed);
      } else {
        raw = [];
      }
    }
  }

  const queries = raw.filter((q): q is string => typeof q === "string").slice(0, 5);
  if (queries.length >= 3) return queries;

  console.warn("[query-generator] invalid format. parsed keys:", parsed && typeof parsed === "object" ? Object.keys(parsed) : "n/a", "raw length:", raw.length, "content sample:", content.slice(0, 500));
  throw new Error("Invalid response format from query generator");
}

export async function generateQueries(
  name: string,
  background: string
): Promise<string[]> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: `You generate search queries that someone might type into an AI assistant (ChatGPT, Claude, etc.) when looking for a professional like the person described. The queries should test whether AI models organically mention this person.

Rules:
- Generate exactly 5 queries
- Do NOT include the person's name in any query
- Queries should be natural questions someone would ask an AI assistant
- Mix query types: "best [role] in [city]", "recommend a [specialty]", comparison/listicle queries, advice-seeking queries
- Keep queries between 10 and 150 characters
- Return a JSON array of 5 strings, nothing else`,
        },
        {
          role: "user",
          content: `Person: ${name}\nBackground: ${background}`,
        },
      ],
      max_completion_tokens: 512,
      response_format: { type: "json_object" },
    });

    const msg = response.choices[0]?.message;
    const rawContent = msg?.content as string | { text: string }[] | undefined;
    let content: string;
    if (typeof rawContent === "string") {
      content = rawContent.trim();
    } else if (Array.isArray(rawContent)) {
      content = rawContent
        .map((p) => (p && typeof p === "object" && "text" in p ? String(p.text ?? "") : ""))
        .join("\n")
        .trim();
    } else {
      content = "{}";
    }
    if (!content) content = "{}";

    console.log("[query-generator] raw content length:", content.length, "preview:", content.slice(0, 300));

    const codeBlock = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) content = codeBlock[1].trim();
    return parseQueryGeneratorContent(content);
  } catch (error) {
    console.error("Query generation failed, using fallback:", error);
    return generateFallbackQueries(background);
  }
}

export function generateFallbackQueries(background: string): string[] {
  const words = background.toLowerCase().split(/\s+/);

  // Extract potential role/specialty keywords
  const roleKeywords = [
    "coach",
    "lawyer",
    "attorney",
    "consultant",
    "therapist",
    "designer",
    "developer",
    "engineer",
    "advisor",
    "trainer",
    "mentor",
    "founder",
    "speaker",
    "author",
    "photographer",
    "architect",
    "planner",
    "agent",
    "broker",
    "doctor",
    "dentist",
    "accountant",
    "strategist",
  ];

  const foundRole = roleKeywords.find((r) => words.includes(r)) || "professional";

  // Extract potential location
  const locationPatterns = /\b(?:in|based in|from|located in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/;
  const locationMatch = background.match(locationPatterns);
  const location = locationMatch?.[1] || "";

  const queries = [
    `Who is the best ${foundRole} ${location ? `in ${location}` : "to work with"}?`,
    `Recommend a good ${foundRole} for ${words.slice(0, 3).join(" ")}`,
    `Top ${foundRole}s ${location ? `in ${location}` : "in the industry"}`,
    `How to find a great ${foundRole}?`,
    `What should I look for when hiring a ${foundRole}?`,
  ];

  return queries;
}
