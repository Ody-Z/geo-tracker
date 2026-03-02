import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  pgEnum,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const scanStatusEnum = pgEnum("scan_status", [
  "pending",
  "running",
  "completed",
  "failed",
]);
export const aiModelEnum = pgEnum("ai_model", [
  "openai",
  "anthropic",
  "perplexity",
  "gemini",
]);
export const sentimentEnum = pgEnum("sentiment", [
  "positive",
  "neutral",
  "negative",
  "not_mentioned",
]);

// Tables
export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  background: text("background"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const queries = pgTable("queries", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  promptText: text("prompt_text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const scans = pgTable("scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  status: scanStatusEnum("status").notNull().default("pending"),
  overallScore: real("overall_score"),
  triggeredBy: text("triggered_by").notNull().default("manual"), // manual | cron
  completedAt: timestamp("completed_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const scanResults = pgTable("scan_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  scanId: uuid("scan_id")
    .notNull()
    .references(() => scans.id, { onDelete: "cascade" }),
  queryId: uuid("query_id")
    .notNull()
    .references(() => queries.id, { onDelete: "cascade" }),
  model: aiModelEnum("model").notNull(),
  responseText: text("response_text"), // truncated to 2000 chars
  brandMentioned: boolean("brand_mentioned").notNull().default(false),
  domainMentioned: boolean("domain_mentioned").notNull().default(false),
  mentionCount: integer("mention_count").notNull().default(0),
  mentionPositions: jsonb("mention_positions").$type<number[]>().default([]),
  citations: jsonb("citations").$type<{ url: string; brandRelated: boolean }[]>().default([]),
  sentiment: sentimentEnum("sentiment").notNull().default("not_mentioned"),
  visibilityScore: real("visibility_score").notNull().default(0),
  rankPosition: integer("rank_position"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Relations
export const brandsRelations = relations(brands, ({ many }) => ({
  queries: many(queries),
  scans: many(scans),
}));

export const queriesRelations = relations(queries, ({ one, many }) => ({
  brand: one(brands, {
    fields: [queries.brandId],
    references: [brands.id],
  }),
  scanResults: many(scanResults),
}));

export const scansRelations = relations(scans, ({ one, many }) => ({
  brand: one(brands, {
    fields: [scans.brandId],
    references: [brands.id],
  }),
  results: many(scanResults),
}));

export const scanResultsRelations = relations(scanResults, ({ one }) => ({
  scan: one(scans, {
    fields: [scanResults.scanId],
    references: [scans.id],
  }),
  query: one(queries, {
    fields: [scanResults.queryId],
    references: [queries.id],
  }),
}));

// Types
export type Brand = typeof brands.$inferSelect;
export type Query = typeof queries.$inferSelect;
export type Scan = typeof scans.$inferSelect;
export type ScanResult = typeof scanResults.$inferSelect;
