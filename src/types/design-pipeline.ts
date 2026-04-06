// ─── MattDESIGN.AI — Design Pipeline Types ───────────────────────────────────

// ─── Creative Brief ──────────────────────────────────────────────────────────

export interface CreativeBrief {
  projectName: string;
  description: string;
  objectiveType: ObjectiveType;
  referenceImages?: string[];
  structureLocked?: boolean;
  needsMask?: boolean;
  needsVector?: boolean;
  targetFormats?: ExportFormat[];
  level: PipelineLevel;
  variants?: VariantStyle[];
  constraints?: string;
  lang?: "fr" | "en";
}

export type ObjectiveType =
  | "logo"
  | "brand-kit"
  | "social-post"
  | "website"
  | "mockup"
  | "ecommerce"
  | "poster"
  | "icon"
  | "packaging"
  | "retouche"
  | "illustration"
  | "photo-editing";

export type PipelineLevel = "simple" | "standard" | "premium";

export type VariantStyle =
  | "clean"
  | "premium"
  | "bold"
  | "minimal"
  | "commercial";

export type ExportFormat =
  | "png"
  | "jpg"
  | "webp"
  | "svg"
  | "pdf"
  | "tiff"
  | "avif";

// ─── Stack Tool ──────────────────────────────────────────────────────────────

export interface DesignStackTool {
  id: DesignToolId;
  name: string;
  category: ToolCategory;
  purpose: string;
  cost: "free" | "open-source";
  isComfyUIModule?: boolean;
  triggerConditions: string[];
}

export type DesignToolId =
  | "comfyui"
  | "comfyui-manager"
  | "ip-adapter"
  | "controlnet"
  | "controlnet-aux"
  | "impact-pack"
  | "sam2"
  | "grounded-sam2"
  | "rembg"
  | "potrace"
  | "inkscape"
  | "digikam"
  | "darktable"
  | "upscayl"
  | "imagemagick"
  | "krita-ai-diffusion"
  | "invokeai"
  | "blender"
  | "photoprism";

export type ToolCategory =
  | "generation"
  | "composition"
  | "controlnet"
  | "segmentation"
  | "detailing"
  | "vectorization"
  | "asset-management"
  | "photo-editing"
  | "upscaling"
  | "conversion"
  | "retouche"
  | "3d-compositing";

// ─── Pipeline Step ───────────────────────────────────────────────────────────

export interface DesignPipelineStep {
  order: number;
  name: string;
  tool: DesignToolId;
  action: string;
  inputs: string[];
  outputs: string[];
  outputDir: AssetDirectory;
  optional?: boolean;
  batchable?: boolean;
}

export type AssetDirectory =
  | "raw"
  | "refs"
  | "masks"
  | "variants"
  | "exports"
  | "prompts"
  | "workflows";

// ─── Pipeline Plan (output of the orchestrator) ─────────────────────────────

export interface DesignPipelinePlan {
  id: string;
  brief: CreativeBrief;
  analysis: BriefAnalysis;
  steps: DesignPipelineStep[];
  directories: DirectoryMap;
  naming: NamingConvention;
  deliverables: Deliverable[];
  qualityChecks: string[];
  automationNotes: string[];
  createdAt: string;
}

export interface BriefAnalysis {
  intention: DesignIntention;
  level: PipelineLevel;
  primaryTool: DesignToolId;
  secondaryTools: DesignToolId[];
  requiredInputs: string[];
  expectedOutput: string;
  qualityControl: string;
}

export type DesignIntention =
  | "generate"
  | "retouch"
  | "cutout"
  | "classify"
  | "normalize"
  | "upscale"
  | "compose"
  | "export"
  | "vectorize";

export interface DirectoryMap {
  raw: string;
  refs: string;
  masks: string;
  variants: string;
  exports: string;
  prompts: string;
  workflows: string;
}

export interface NamingConvention {
  pattern: string;
  example: string;
  fields: string[];
}

export interface Deliverable {
  name: string;
  format: ExportFormat;
  directory: AssetDirectory;
  variant?: VariantStyle;
}

// ─── Prompt Archive ──────────────────────────────────────────────────────────

export interface PromptArchive {
  id: string;
  projectName: string;
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  model?: string;
  sampler?: string;
  steps?: number;
  cfg?: number;
  dimensions?: { width: number; height: number };
  workflowJson?: string;
  createdAt: string;
}

// ─── Library ─────────────────────────────────────────────────────────────────

export interface DesignLibrary {
  prompts: PromptArchive[];
  negativePrompts: string[];
  palettes: { name: string; colors: string[] }[];
  styles: string[];
  references: string[];
  workflows: string[];
  exports: string[];
}

// ─── Pipeline State ──────────────────────────────────────────────────────────

export interface DesignPipelineState {
  id: string;
  brief: CreativeBrief;
  plan: DesignPipelinePlan;
  status: DesignPipelineStatus;
  currentStep?: number;
  completedSteps: number[];
  errors: string[];
  startedAt: string;
  completedAt?: string;
}

export type DesignPipelineStatus =
  | "planning"
  | "running"
  | "paused"
  | "complete"
  | "error";

// ─── Decision Mode ───────────────────────────────────────────────────────────

export interface DecisionMode {
  id: string;
  label: string;
  need: string;
  primaryTools: DesignToolId[];
  description: string;
}
