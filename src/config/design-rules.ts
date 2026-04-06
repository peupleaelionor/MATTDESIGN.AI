// ─── MattDESIGN.AI — Design Pipeline Rules & Quality ─────────────────────────

// ─── Absolute Rules (17) ─────────────────────────────────────────────────────
// These rules are non-negotiable and must be enforced by the orchestrator.

export const ABSOLUTE_RULES = [
  /* 1  */ "Never propose a tool outside the authorized stack without flagging it as external.",
  /* 2  */ "Never overwrite an original file.",
  /* 3  */ "Always separate directories: raw, refs, masks, variants, exports, prompts.",
  /* 4  */ "Always archive the prompt used.",
  /* 5  */ "Always preserve technical parameters (seed, model, sampler, steps, cfg).",
  /* 6  */ "Always propose a minimal workflow then a premium workflow.",
  /* 7  */ "If a task can be batch-automated, propose the batch.",
  /* 8  */ "If a task requires a mask, request it or flag the need.",
  /* 9  */ "If a task requires upscale, perform it last.",
  /* 10 */ "If the task is an asset search, use digiKam or PhotoPrism.",
  /* 11 */ "If the task is complex generation, use ComfyUI.",
  /* 12 */ "If the task is precise retouche, use Krita AI Diffusion.",
  /* 13 */ "If the task is cleanup, conversion or normalization, use ImageMagick.",
  /* 14 */ "If the task is background removal, use rembg or SAM 2.",
  /* 15 */ "If the task is enlargement, use Upscayl.",
  /* 16 */ "If the task involves 3D rendering, advanced compositing or complex mockup, use Blender.",
  /* 17 */ "Always follow production logic, never demo logic.",
] as const;

// ─── Orchestration Rules (from stack prioritaire) ────────────────────────────

export const ORCHESTRATION_RULES = [
  /* 1  */ "Always start by analyzing the objective: logo, brand kit, social post, website, mockup, ecommerce, poster, icon, packaging, or retouche.",
  /* 2  */ "If a visual reference exists, apply IP-Adapter.",
  /* 3  */ "If the structure must be respected, apply ControlNet.",
  /* 4  */ "If a cutout or mask is needed, apply SAM 2 or rembg.",
  /* 5  */ "If the output lacks sharpness, apply Impact-Pack then final upscale.",
  /* 6  */ "If the deliverable must be SVG or vector logo, route through Potrace then Inkscape.",
  /* 7  */ "Always save: prompt, seed, workflow JSON, versions, preview, final export, and metadata.",
  /* 8  */ "Always create multiple variants: clean, premium, bold, minimal, commercial.",
  /* 9  */ "Always use stable file naming: project-type-date-version-seed.",
  /* 10 */ "Always maintain a library of: prompts, negative prompts, palettes, styles, references, workflow JSONs, final exports.",
] as const;

// ─── Quality Checklist ───────────────────────────────────────────────────────

export const QUALITY_CHECKLIST = [
  "Readability",
  "Sharpness",
  "Clean edges",
  "No artifacts",
  "Colour consistency",
  "Style consistency",
  "Files properly organized",
  "Originals preserved",
  "Variants conserved",
  "Exports clean",
  "Prompt archived",
  "Seed archived",
  "Workflow JSON archived",
  "Metadata complete",
] as const;

// ─── Variant Styles ──────────────────────────────────────────────────────────

export const VARIANT_STYLES = [
  "clean",
  "premium",
  "bold",
  "minimal",
  "commercial",
] as const;

// ─── Standard Directory Structure ────────────────────────────────────────────

export const STANDARD_DIRECTORIES = [
  "raw",
  "refs",
  "masks",
  "variants",
  "exports",
  "prompts",
  "workflows",
] as const;

// ─── File Naming Pattern ─────────────────────────────────────────────────────

export const NAMING_PATTERN = {
  pattern: "{project}-{type}-{date}-{version}-{seed}",
  fields: ["project", "type", "date", "version", "seed"],
  example: "acme-logo-20260406-v01-42857",
  separator: "-",
} as const;

// ─── Library Categories ──────────────────────────────────────────────────────

export const LIBRARY_CATEGORIES = [
  "prompts",
  "negative-prompts",
  "palettes",
  "styles",
  "references",
  "workflows",
  "exports",
] as const;

// ─── Pipeline Standards ──────────────────────────────────────────────────────
// Canonical 9-step pipeline from the orchestrator spec.

export const STANDARD_PIPELINE_STEPS = [
  { order: 1, name: "Ingest raw files", directory: "raw" },
  { order: 2, name: "Index / classify assets", directory: "refs" },
  { order: 3, name: "Select references", directory: "refs" },
  { order: 4, name: "Generate in ComfyUI or InvokeAI", directory: "variants" },
  { order: 5, name: "Fine retouche in Krita AI Diffusion", directory: "variants" },
  { order: 6, name: "Segment / cutout with rembg or SAM 2", directory: "masks" },
  { order: 7, name: "Final upscale with Upscayl", directory: "variants" },
  { order: 8, name: "Normalize / convert / export with ImageMagick", directory: "exports" },
  { order: 9, name: "Archive variants, prompts and parameters", directory: "prompts" },
] as const;
