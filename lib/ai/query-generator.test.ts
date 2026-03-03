import { describe, it, expect, beforeAll } from "vitest";
import {
  generateQueries,
  parseQueryGeneratorContent,
  generateFallbackQueries,
} from "./query-generator";

describe("parseQueryGeneratorContent (unit)", () => {
  it("parses JSON array of strings", () => {
    const content = JSON.stringify([
      "Best executive coach in San Francisco",
      "Recommend a leadership coach for tech",
      "Top coaches for communication",
      "How to find an executive coach",
      "What to look for in a leadership coach",
    ]);
    expect(parseQueryGeneratorContent(content)).toHaveLength(5);
    expect(parseQueryGeneratorContent(content)[0]).toBe(
      "Best executive coach in San Francisco"
    );
  });

  it("parses object with queries key", () => {
    const content = JSON.stringify({
      queries: ["Query one", "Query two", "Query three"],
    });
    const out = parseQueryGeneratorContent(content);
    expect(out).toHaveLength(3);
    expect(out).toEqual(["Query one", "Query two", "Query three"]);
  });

  it("parses object with items key", () => {
    const content = JSON.stringify({
      items: ["A", "B", "C", "D"],
    });
    expect(parseQueryGeneratorContent(content)).toEqual(["A", "B", "C", "D"]);
  });

  it("parses object with first array value (any key)", () => {
    const content = JSON.stringify({
      search_queries: ["q1", "q2", "q3"],
    });
    expect(parseQueryGeneratorContent(content)).toEqual(["q1", "q2", "q3"]);
  });

  it("parses object with all-string values", () => {
    const content = JSON.stringify({
      "1": "First query",
      "2": "Second query",
      "3": "Third query",
    });
    expect(parseQueryGeneratorContent(content).length).toBe(3);
    expect(parseQueryGeneratorContent(content)).toContain("First query");
  });

  it("strips markdown code block and parses", () => {
    const content = "```json\n{\"queries\": [\"a\", \"b\", \"c\"]}\n```";
    expect(parseQueryGeneratorContent(content)).toEqual(["a", "b", "c"]);
  });

  it("filters non-strings and returns valid slice", () => {
    const content = JSON.stringify({
      queries: ["ok1", 42, "ok2", null, "ok3"],
    });
    expect(parseQueryGeneratorContent(content)).toEqual(["ok1", "ok2", "ok3"]);
  });

  it("throws when fewer than 3 valid string queries", () => {
    expect(() => parseQueryGeneratorContent("{}")).toThrow(
      "Invalid response format from query generator"
    );
    expect(() =>
      parseQueryGeneratorContent(JSON.stringify({ queries: ["a", "b"] }))
    ).toThrow("Invalid response format from query generator");
    expect(() =>
      parseQueryGeneratorContent(JSON.stringify(["only", "two"]))
    ).toThrow("Invalid response format from query generator");
  });

  it("parses array from content with surrounding text", () => {
    const content = 'Some text\n["q1", "q2", "q3", "q4"]\nmore text';
    const out = parseQueryGeneratorContent(content);
    expect(out.length).toBeGreaterThanOrEqual(3);
    expect(out).toContain("q1");
  });
});

describe("generateQueries (integration, real API)", () => {
  beforeAll(() => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required. Set it in .env.local");
    }
  });

  it("returns 3–5 string queries and does NOT use fallback", async () => {
    const name = "Jane Smith";
    const background =
      "Executive coach based in San Francisco. Helps tech leaders with communication and strategy.";
    const queries = await generateQueries(name, background);
    const fallback = generateFallbackQueries(background);

    expect(Array.isArray(queries)).toBe(true);
    expect(queries.length).toBeGreaterThanOrEqual(3);
    expect(queries.length).toBeLessThanOrEqual(5);
    queries.forEach((q) => {
      expect(typeof q).toBe("string");
      expect(q.length).toBeGreaterThanOrEqual(10);
      expect(q.length).toBeLessThanOrEqual(200);
    });
    expect(queries).not.toEqual(fallback);
  });

  it("does not include the person's name in any query", async () => {
    const name = "Ray Penber";
    const background =
      "JavaScript Fullstack Developer based in Sandy Springs, Fulton. MERN stack, React, UI Engineer.";
    const queries = await generateQueries(name, background);
    const fallback = generateFallbackQueries(background);

    expect(queries).not.toEqual(fallback);
    const nameParts = name.toLowerCase().split(/\s+/);
    queries.forEach((q) => {
      const lower = q.toLowerCase();
      nameParts.forEach((part) => {
        expect(lower).not.toContain(part);
      });
    });
  });

  it("returns distinct queries", async () => {
    const name = "Alex Chen";
    const background =
      "Immigration lawyer in New York. Specializes in H-1B and green cards.";
    const queries = await generateQueries(name, background);
    const fallback = generateFallbackQueries(background);

    expect(queries).not.toEqual(fallback);
    const unique = new Set(queries.map((q) => q.trim().toLowerCase()));
    expect(unique.size).toBe(queries.length);
  });

  it("handles minimal background and does not use fallback", async () => {
    const name = "Sam Doe";
    const background = "Financial advisor in Boston.";
    const queries = await generateQueries(name, background);
    const fallback = generateFallbackQueries(background);

    expect(queries).not.toEqual(fallback);
    expect(queries.length).toBeGreaterThanOrEqual(3);
    expect(queries.every((q) => typeof q === "string" && q.length >= 5)).toBe(
      true
    );
  });
});
