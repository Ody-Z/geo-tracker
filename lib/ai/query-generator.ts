import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    // Handle both { queries: [...] } and direct array
    const queries: unknown[] = Array.isArray(parsed)
      ? parsed
      : parsed.queries || parsed.items || Object.values(parsed)[0];

    if (
      Array.isArray(queries) &&
      queries.length >= 3 &&
      queries.every((q) => typeof q === "string")
    ) {
      return (queries as string[]).slice(0, 5);
    }

    throw new Error("Invalid response format from query generator");
  } catch (error) {
    console.error("Query generation failed, using fallback:", error);
    return generateFallbackQueries(background);
  }
}

function generateFallbackQueries(background: string): string[] {
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
