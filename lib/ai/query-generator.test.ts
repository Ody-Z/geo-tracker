import { describe, it, expect, beforeAll } from "vitest";
import { generateQueries } from "./query-generator";

describe("generateQueries (real OpenAI API)", () => {
  beforeAll(() => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required. Set it in .env.local");
    }
  });

  it("returns 3–5 string queries for a coach", async () => {
    const name = "Jane Smith";
    const background =
      "Executive coach based in San Francisco. Helps tech leaders with communication and strategy.";
    const queries = await generateQueries(name, background);

    expect(Array.isArray(queries)).toBe(true);
    expect(queries.length).toBeGreaterThanOrEqual(3);
    expect(queries.length).toBeLessThanOrEqual(5);
    queries.forEach((q) => {
      expect(typeof q).toBe("string");
      expect(q.length).toBeGreaterThanOrEqual(10);
      expect(q.length).toBeLessThanOrEqual(200);
    });
  });

  it("does not include the person's name in any query", async () => {
    const name = "Ray Penber";
    const background =
      "JavaScript Fullstack Developer based in Sandy Springs, Fulton. MERN stack, React, UI Engineer.";
    const queries = await generateQueries(name, background);

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

    const unique = new Set(queries.map((q) => q.trim().toLowerCase()));
    expect(unique.size).toBe(queries.length);
  });

  it("handles minimal background and still returns valid queries", async () => {
    const name = "Sam Doe";
    const background = "Financial advisor in Boston.";
    const queries = await generateQueries(name, background);

    expect(queries.length).toBeGreaterThanOrEqual(3);
    expect(queries.every((q) => typeof q === "string" && q.length >= 5)).toBe(true);
  });

  it("passes name and background correctly (output reflects background when fallback)", async () => {
    const name = "Nobody Famous";
    const background = "Executive coach in Austin.";
    const queries = await generateQueries(name, background);

    const text = queries.join(" ").toLowerCase();
    expect(queries.length).toBeGreaterThanOrEqual(3);
    expect(
      text.includes("coach") || text.includes("austin") || text.includes("professional")
    ).toBe(true);
  });
});
