import { z } from "zod";

export const scanFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  background: z
    .string()
    .min(10, "Please provide at least 10 characters about your background")
    .max(500, "Background must be under 500 characters"),
});

export type ScanFormData = z.infer<typeof scanFormSchema>;
