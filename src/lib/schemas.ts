import { z } from "zod/v4";

// ─── MattDESIGN.AI — Input Validation Schemas ────────────────────────────────

export const toneSchema = z.enum([
  "professional",
  "playful",
  "bold",
  "minimal",
  "luxury",
]);

export const langSchema = z.enum(["en", "fr"]);

export const projectBriefSchema = z.object({
  projectName: z
    .string()
    .min(1, "Project name is required")
    .max(200, "Project name is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description is too long"),
  sector: z.string().max(100).optional(),
  audience: z.string().max(500).optional(),
  style: z.string().max(200).optional(),
  tone: toneSchema.optional(),
  goals: z.array(z.string().max(200)).max(10).optional(),
  competitors: z.array(z.string().max(200)).max(10).optional(),
  constraints: z.string().max(2000).optional(),
  lang: langSchema.optional(),
});

export type ValidatedBrief = z.infer<typeof projectBriefSchema>;

export const feedbackSchema = z.object({
  id: z.string().min(1),
  score: z.number().min(0).max(100),
  comment: z.string().max(2000).optional(),
});

export type ValidatedFeedback = z.infer<typeof feedbackSchema>;
