import type {
  CreativeBrief,
  ObjectiveType,
  DesignIntention,
  DesignToolId,
  BriefAnalysis,
} from "@/types/design-pipeline";
import { DESIGN_STACK_MAP } from "@/config/design-stack";

// ─── MattDESIGN.AI — Pipeline Planner / Decision Method ──────────────────────
// Routes a creative brief to the correct tools based on the orchestration rules.

// ─── Objective → Intention mapping ───────────────────────────────────────────

const OBJECTIVE_TO_INTENTION: Record<ObjectiveType, DesignIntention> = {
  logo: "generate",
  "brand-kit": "generate",
  "social-post": "generate",
  website: "compose",
  mockup: "compose",
  ecommerce: "generate",
  poster: "generate",
  icon: "generate",
  packaging: "compose",
  retouche: "retouch",
  illustration: "generate",
  "photo-editing": "retouch",
};

// ─── Objective → Primary tool mapping ────────────────────────────────────────

const OBJECTIVE_TO_PRIMARY_TOOL: Record<ObjectiveType, DesignToolId> = {
  logo: "comfyui",
  "brand-kit": "comfyui",
  "social-post": "comfyui",
  website: "comfyui",
  mockup: "blender",
  ecommerce: "comfyui",
  poster: "comfyui",
  icon: "comfyui",
  packaging: "blender",
  retouche: "krita-ai-diffusion",
  illustration: "comfyui",
  "photo-editing": "darktable",
};

// ─── Analyze a creative brief ────────────────────────────────────────────────

export function analyzeBrief(brief: CreativeBrief): BriefAnalysis {
  const intention = OBJECTIVE_TO_INTENTION[brief.objectiveType];
  const primaryTool = OBJECTIVE_TO_PRIMARY_TOOL[brief.objectiveType];
  const secondaryTools = resolveSecondaryTools(brief);
  const requiredInputs = resolveRequiredInputs(brief);
  const expectedOutput = resolveExpectedOutput(brief);
  const qualityControl = resolveQualityControl(brief);

  return {
    intention,
    level: brief.level,
    primaryTool,
    secondaryTools,
    requiredInputs,
    expectedOutput,
    qualityControl,
  };
}

// ─── Resolve secondary tools based on brief conditions ───────────────────────

function resolveSecondaryTools(brief: CreativeBrief): DesignToolId[] {
  const tools: DesignToolId[] = [];

  // Rule 2: Reference image → IP-Adapter
  if (brief.referenceImages && brief.referenceImages.length > 0) {
    tools.push("ip-adapter");
  }

  // Rule 3: Structure locked → ControlNet + Aux
  if (brief.structureLocked) {
    tools.push("controlnet", "controlnet-aux");
  }

  // Rule 4: Mask needed → SAM 2 or rembg
  if (brief.needsMask) {
    tools.push("sam2");
  }

  // Rule 6: Vector deliverable → Potrace + Inkscape
  if (brief.needsVector || isVectorObjective(brief.objectiveType)) {
    tools.push("potrace", "inkscape");
  }

  // Rule 5: Always add Impact-Pack for detailing in standard/premium
  if (brief.level !== "simple") {
    tools.push("impact-pack");
  }

  // Rule 9: Upscale is always last
  if (brief.level === "premium" || brief.level === "standard") {
    tools.push("upscayl");
  }

  // Always include ImageMagick for final conversion/export
  tools.push("imagemagick");

  // Always include digiKam for asset indexing
  tools.push("digikam");

  // Background removal for specific objectives
  if (needsBackgroundRemoval(brief.objectiveType)) {
    if (!tools.includes("sam2")) {
      tools.push("rembg");
    }
  }

  // Deduplicate
  return [...new Set(tools)];
}

// ─── Helper: does this objective typically need vector output? ────────────────

function isVectorObjective(objective: ObjectiveType): boolean {
  return objective === "logo" || objective === "icon";
}

// ─── Helper: does this objective typically need background removal? ───────────

function needsBackgroundRemoval(objective: ObjectiveType): boolean {
  return (
    objective === "logo" ||
    objective === "icon" ||
    objective === "ecommerce" ||
    objective === "packaging"
  );
}

// ─── Resolve required inputs ─────────────────────────────────────────────────

function resolveRequiredInputs(brief: CreativeBrief): string[] {
  const inputs: string[] = ["Creative brief description"];

  if (brief.referenceImages && brief.referenceImages.length > 0) {
    inputs.push("Reference images (for IP-Adapter)");
  }

  if (brief.structureLocked) {
    inputs.push("Structure reference (for ControlNet hint generation)");
  }

  if (brief.needsMask) {
    inputs.push("Mask or source image for segmentation");
  }

  if (brief.objectiveType === "retouche" || brief.objectiveType === "photo-editing") {
    inputs.push("Source image(s) to edit");
  }

  if (brief.objectiveType === "mockup" || brief.objectiveType === "packaging") {
    inputs.push("3D template or scene file (Blender)");
  }

  return inputs;
}

// ─── Resolve expected output ─────────────────────────────────────────────────

function resolveExpectedOutput(brief: CreativeBrief): string {
  const formats = brief.targetFormats?.join(", ") ?? "png";
  const variantCount = brief.level === "premium" ? 5 : brief.level === "standard" ? 3 : 1;

  const descriptions: Record<ObjectiveType, string> = {
    logo: `${variantCount} logo variant(s) in ${formats}, plus vector SVG`,
    "brand-kit": `Complete brand kit: logo, palette, typography, ${variantCount} variant(s) in ${formats}`,
    "social-post": `${variantCount} social media visual(s) in ${formats}`,
    website: `Website hero + section visuals, ${variantCount} variant(s) in ${formats}`,
    mockup: `Product mockup render(s) in ${formats}`,
    ecommerce: `${variantCount} product visual(s) with transparent background in ${formats}`,
    poster: `${variantCount} poster variant(s) in ${formats}`,
    icon: `${variantCount} icon variant(s) in ${formats}, plus vector SVG`,
    packaging: `Packaging design render(s) in ${formats}`,
    retouche: `Retouched image(s) in ${formats}`,
    illustration: `${variantCount} illustration variant(s) in ${formats}`,
    "photo-editing": `Edited photo(s) in ${formats}`,
  };

  return descriptions[brief.objectiveType];
}

// ─── Resolve quality control description ─────────────────────────────────────

function resolveQualityControl(brief: CreativeBrief): string {
  const checks: string[] = [
    "Visual inspection for artifacts",
    "Edge sharpness check",
    "Colour consistency verification",
  ];

  if (brief.needsVector || isVectorObjective(brief.objectiveType)) {
    checks.push("Vector path quality check (Inkscape)");
  }

  if (brief.level === "premium") {
    checks.push(
      "Multi-variant comparison",
      "Style consistency across variants",
      "Final export format validation",
    );
  }

  return checks.join("; ");
}

// ─── Select decision mode ────────────────────────────────────────────────────

export function selectDecisionMode(brief: CreativeBrief): string {
  if (brief.needsVector || isVectorObjective(brief.objectiveType)) {
    return "vector-logo";
  }
  if (brief.referenceImages && brief.referenceImages.length > 0) {
    return "style-faithful";
  }
  if (brief.structureLocked) {
    return "controlled-composition";
  }
  if (brief.objectiveType === "photo-editing") {
    return "photo-serious";
  }
  if (brief.objectiveType === "retouche") {
    return "precise-retouche";
  }
  if (brief.objectiveType === "mockup" || brief.objectiveType === "packaging") {
    return "3d-mockup";
  }
  if (brief.level === "simple") {
    return "fast-clean";
  }
  return "style-faithful";
}

// ─── Validate that all resolved tools exist in the stack ─────────────────────

export function validateToolsInStack(toolIds: DesignToolId[]): {
  valid: boolean;
  missing: string[];
} {
  const missing = toolIds.filter((id) => !DESIGN_STACK_MAP[id]);
  return { valid: missing.length === 0, missing };
}
