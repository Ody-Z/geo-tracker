import { z } from "zod";

export const scanFormSchema = z.object({
  brandName: z
    .string()
    .min(1, "Brand name is required")
    .max(100, "Brand name must be under 100 characters"),
  domain: z
    .string()
    .max(200, "Domain must be under 200 characters")
    .optional()
    .transform((val) => val || null),
  queries: z
    .array(
      z
        .string()
        .min(10, "Query must be at least 10 characters")
        .max(500, "Query must be under 500 characters")
    )
    .min(1, "At least one query is required")
    .max(3, "Maximum 3 queries for free scan"),
});

export type ScanFormData = z.infer<typeof scanFormSchema>;
