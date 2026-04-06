import type {
  CreativeBrief,
  DesignPipelinePlan,
  DesignPipelineStep,
  DesignPipelineState,
  DirectoryMap,
  NamingConvention,
  Deliverable,
  DesignToolId,
  VariantStyle,
} from "@/types/design-pipeline";
import { uid } from "@/lib/utils";
import { analyzeBrief, selectDecisionMode, validateToolsInStack } from "./pipeline-planner";
import {
  NAMING_PATTERN,
  QUALITY_CHECKLIST,
  VARIANT_STYLES,
  ABSOLUTE_RULES,
} from "@/config/design-rules";
import { DESIGN_STACK_MAP } from "@/config/design-stack";

// ─── MattDESIGN.AI — Design Pipeline Orchestrator ────────────────────────────
// Transforms a creative brief into a full execution plan.
// Never invents tools. Never overwrites originals. Always traces everything.

export type DesignProgressCallback = (state: DesignPipelineState) => void;

// ─── Plan a design pipeline ──────────────────────────────────────────────────

export function planDesignPipeline(brief: CreativeBrief): DesignPipelinePlan {
  const analysis = analyzeBrief(brief);
  // Validate all tools are in the authorized stack
  const allTools = [analysis.primaryTool, ...analysis.secondaryTools];
  const validation = validateToolsInStack(allTools);
  if (!validation.valid) {
    throw new Error(
      `[Orchestrator] Tools not in authorized stack: ${validation.missing.join(", ")}. ` +
      `Rule 1: ${ABSOLUTE_RULES[0]}`,
    );
  }

  const projectSlug = slugify(brief.projectName);
  const dateStr = formatDate();

  const directories = buildDirectoryMap(projectSlug);
  const naming = buildNamingConvention(projectSlug, brief.objectiveType);
  const steps = buildPipelineSteps(brief, analysis.primaryTool, analysis.secondaryTools, projectSlug);
  const deliverables = buildDeliverables(brief, projectSlug, dateStr);
  const qualityChecks = resolveQualityChecks(brief);
  const automationNotes = resolveAutomationNotes(brief, steps);

  return {
    id: uid("plan"),
    brief,
    analysis,
    steps,
    directories,
    naming,
    deliverables,
    qualityChecks,
    automationNotes,
    createdAt: new Date().toISOString(),
  };
}

// ─── Build directory map ─────────────────────────────────────────────────────

function buildDirectoryMap(projectSlug: string): DirectoryMap {
  const base = `assets/${projectSlug}`;
  return {
    raw: `${base}/raw`,
    refs: `${base}/refs`,
    masks: `${base}/masks`,
    variants: `${base}/variants`,
    exports: `${base}/exports`,
    prompts: `${base}/prompts`,
    workflows: `${base}/workflows`,
  };
}

// ─── Build naming convention ─────────────────────────────────────────────────

function buildNamingConvention(projectSlug: string, objectiveType: string): NamingConvention {
  return {
    pattern: NAMING_PATTERN.pattern,
    example: `${projectSlug}-${objectiveType}-${formatDate()}-v01-00000`,
    fields: [...NAMING_PATTERN.fields],
  };
}

// ─── Build pipeline steps ────────────────────────────────────────────────────

function buildPipelineSteps(
  brief: CreativeBrief,
  primaryTool: DesignToolId,
  secondaryTools: DesignToolId[],
  projectSlug: string,
): DesignPipelineStep[] {
  const steps: DesignPipelineStep[] = [];
  let order = 0;

  // Step 1: Ingest raw files
  steps.push({
    order: ++order,
    name: "Ingest raw files",
    tool: "digikam",
    action: "Import source files into raw directory and index in digiKam",
    inputs: ["Source files", "Reference images"],
    outputs: [`assets/${projectSlug}/raw/*`],
    outputDir: "raw",
    batchable: true,
  });

  // Step 2: Index and classify
  steps.push({
    order: ++order,
    name: "Index and classify assets",
    tool: "digikam",
    action: "Tag, label and classify imported assets by type, style, palette and usage",
    inputs: [`assets/${projectSlug}/raw/*`],
    outputs: ["Tagged and classified assets in digiKam"],
    outputDir: "refs",
    batchable: true,
  });

  // Step 3: Select references
  if (brief.referenceImages && brief.referenceImages.length > 0) {
    steps.push({
      order: ++order,
      name: "Prepare references for IP-Adapter",
      tool: "ip-adapter",
      action: "Load reference images to impose style, subject or mood via IP-Adapter",
      inputs: brief.referenceImages,
      outputs: [`assets/${projectSlug}/refs/*`],
      outputDir: "refs",
    });
  }

  // Step 4: Generate ControlNet hints (if structure locked)
  if (brief.structureLocked && secondaryTools.includes("controlnet")) {
    steps.push({
      order: ++order,
      name: "Generate ControlNet hint images",
      tool: "controlnet-aux",
      action: "Extract canny edges, depth maps or openpose from reference to lock structure",
      inputs: [`assets/${projectSlug}/refs/*`],
      outputs: [`assets/${projectSlug}/refs/hints/*`],
      outputDir: "refs",
    });
  }

  // Step 5: Main generation
  steps.push({
    order: ++order,
    name: "Generate visuals",
    tool: primaryTool,
    action: buildGenerationAction(brief, primaryTool, secondaryTools),
    inputs: buildGenerationInputs(brief, projectSlug),
    outputs: [`assets/${projectSlug}/variants/*`],
    outputDir: "variants",
    batchable: brief.level === "premium",
  });

  // Step 6: Archive prompt
  steps.push({
    order: ++order,
    name: "Archive prompt and parameters",
    tool: "comfyui",
    action: "Save prompt, negative prompt, seed, model, sampler, steps, cfg and workflow JSON",
    inputs: ["Generation parameters"],
    outputs: [
      `assets/${projectSlug}/prompts/*.json`,
      `assets/${projectSlug}/workflows/*.json`,
    ],
    outputDir: "prompts",
  });

  // Step 7: Fine retouche (standard + premium)
  if (brief.level !== "simple") {
    steps.push({
      order: ++order,
      name: "Fine retouche",
      tool: "krita-ai-diffusion",
      action: "Precise local retouche, inpaint corrections, edge cleanup",
      inputs: [`assets/${projectSlug}/variants/*`],
      outputs: [`assets/${projectSlug}/variants/*_retouched`],
      outputDir: "variants",
      optional: brief.level === "standard",
    });
  }

  // Step 8: Segmentation / cutout (if needed)
  if (brief.needsMask || needsBackgroundRemoval(brief.objectiveType)) {
    const segTool = brief.needsMask ? "sam2" as DesignToolId : "rembg" as DesignToolId;
    steps.push({
      order: ++order,
      name: "Segment / remove background",
      tool: segTool,
      action: segTool === "sam2"
        ? "Precise object segmentation for clean masks and targeted edits"
        : "Fast background removal for transparent export",
      inputs: [`assets/${projectSlug}/variants/*`],
      outputs: [`assets/${projectSlug}/masks/*`],
      outputDir: "masks",
      batchable: true,
    });
  }

  // Step 9: Detail enhancement (standard + premium)
  if (secondaryTools.includes("impact-pack")) {
    steps.push({
      order: ++order,
      name: "Detail enhancement",
      tool: "impact-pack",
      action: "Run detailer and face-fix nodes for sharpness and clarity",
      inputs: [`assets/${projectSlug}/variants/*`],
      outputs: [`assets/${projectSlug}/variants/*_detailed`],
      outputDir: "variants",
      optional: true,
    });
  }

  // Step 10: Vectorization (if needed)
  if (brief.needsVector || isVectorObjective(brief.objectiveType)) {
    steps.push({
      order: ++order,
      name: "Vectorize with Potrace",
      tool: "potrace",
      action: "Convert bitmap to SVG vector",
      inputs: [`assets/${projectSlug}/variants/*`],
      outputs: [`assets/${projectSlug}/exports/*.svg`],
      outputDir: "exports",
    });

    steps.push({
      order: ++order,
      name: "Clean vectors in Inkscape",
      tool: "inkscape",
      action: "Clean paths, correct anchors, finalize vector assets",
      inputs: [`assets/${projectSlug}/exports/*.svg`],
      outputs: [`assets/${projectSlug}/exports/*_final.svg`],
      outputDir: "exports",
    });
  }

  // Step 11: Upscale (always last visual step — Rule 9)
  if (secondaryTools.includes("upscayl")) {
    steps.push({
      order: ++order,
      name: "Final upscale",
      tool: "upscayl",
      action: "Upscale final variants to production resolution",
      inputs: [`assets/${projectSlug}/variants/*`],
      outputs: [`assets/${projectSlug}/variants/*_upscaled`],
      outputDir: "variants",
      batchable: true,
    });
  }

  // Step 12: Normalize and export (always last step)
  steps.push({
    order: ++order,
    name: "Normalize, convert and export",
    tool: "imagemagick",
    action: buildExportAction(brief),
    inputs: [`assets/${projectSlug}/variants/*`],
    outputs: [`assets/${projectSlug}/exports/*`],
    outputDir: "exports",
    batchable: true,
  });

  return steps;
}

// ─── Build generation action description ─────────────────────────────────────

function buildGenerationAction(
  brief: CreativeBrief,
  primaryTool: DesignToolId,
  secondaryTools: DesignToolId[],
): string {
  const toolName = DESIGN_STACK_MAP[primaryTool]?.name ?? primaryTool;
  const parts = [`Generate ${brief.objectiveType} visuals using ${toolName}`];

  if (secondaryTools.includes("ip-adapter")) {
    parts.push("with IP-Adapter for style transfer");
  }
  if (secondaryTools.includes("controlnet")) {
    parts.push("with ControlNet for structure control");
  }

  const variantCount = brief.level === "premium" ? 5 : brief.level === "standard" ? 3 : 1;
  parts.push(`— ${variantCount} variant(s): ${(brief.variants ?? VARIANT_STYLES.map((v) => v)).join(", ")}`);

  return parts.join(" ");
}

// ─── Build generation inputs ─────────────────────────────────────────────────

function buildGenerationInputs(brief: CreativeBrief, projectSlug: string): string[] {
  const inputs = ["Creative brief prompt"];

  if (brief.referenceImages && brief.referenceImages.length > 0) {
    inputs.push(`assets/${projectSlug}/refs/* (IP-Adapter references)`);
  }
  if (brief.structureLocked) {
    inputs.push(`assets/${projectSlug}/refs/hints/* (ControlNet hints)`);
  }

  return inputs;
}

// ─── Build export action ─────────────────────────────────────────────────────

function buildExportAction(brief: CreativeBrief): string {
  const formats = brief.targetFormats?.join(", ") ?? "png, webp";
  return `Convert and normalize all final variants to ${formats} using ImageMagick — batch mode`;
}

// ─── Build deliverables list ─────────────────────────────────────────────────

function buildDeliverables(
  brief: CreativeBrief,
  projectSlug: string,
  dateStr: string,
): Deliverable[] {
  const deliverables: Deliverable[] = [];
  const formats = brief.targetFormats ?? ["png"];
  const variants: VariantStyle[] = brief.variants ?? [...VARIANT_STYLES];
  const variantCount = brief.level === "premium" ? 5 : brief.level === "standard" ? 3 : 1;
  const activeVariants = variants.slice(0, variantCount);

  for (const variant of activeVariants) {
    for (const format of formats) {
      deliverables.push({
        name: `${projectSlug}-${brief.objectiveType}-${dateStr}-${variant}`,
        format,
        directory: "exports",
        variant,
      });
    }
  }

  // Add vector deliverables if needed
  if (brief.needsVector || isVectorObjective(brief.objectiveType)) {
    for (const variant of activeVariants) {
      deliverables.push({
        name: `${projectSlug}-${brief.objectiveType}-${dateStr}-${variant}`,
        format: "svg",
        directory: "exports",
        variant,
      });
    }
  }

  // Always add prompt archive as deliverable
  deliverables.push({
    name: `${projectSlug}-prompts-${dateStr}`,
    format: "pdf",
    directory: "prompts",
  });

  return deliverables;
}

// ─── Resolve quality checks ──────────────────────────────────────────────────

function resolveQualityChecks(brief: CreativeBrief): string[] {
  const checks: string[] = [...QUALITY_CHECKLIST];

  if (brief.needsVector || isVectorObjective(brief.objectiveType)) {
    checks.push("Vector path quality (no stray nodes)");
    checks.push("SVG renders correctly at all sizes");
  }

  if (brief.level === "premium") {
    checks.push("Multi-variant comparison approved");
    checks.push("All 5 variants pass quality gate");
  }

  return [...checks];
}

// ─── Resolve automation notes ────────────────────────────────────────────────

function resolveAutomationNotes(
  brief: CreativeBrief,
  steps: DesignPipelineStep[],
): string[] {
  const notes: string[] = [];
  const batchableSteps = steps.filter((s) => s.batchable);

  if (batchableSteps.length > 0) {
    notes.push(
      `Batchable steps: ${batchableSteps.map((s) => s.name).join(", ")}`,
    );
  }

  if (brief.level === "premium") {
    notes.push("Premium mode: generate all 5 variant styles in a single ComfyUI batch");
    notes.push("Use ComfyUI queue for parallel variant generation");
  }

  notes.push("Export step can be fully automated with ImageMagick batch script");
  notes.push("Asset indexing in digiKam can run as background task");

  if (brief.needsVector || isVectorObjective(brief.objectiveType)) {
    notes.push("Potrace + Inkscape pipeline can be scripted for batch vectorization");
  }

  return notes;
}

// ─── Execute a planned pipeline ──────────────────────────────────────────────

export async function executeDesignPipeline(
  plan: DesignPipelinePlan,
  onProgress?: DesignProgressCallback,
): Promise<DesignPipelineState> {
  const state: DesignPipelineState = {
    id: uid("dpipe"),
    brief: plan.brief,
    plan,
    status: "running",
    currentStep: undefined,
    completedSteps: [],
    errors: [],
    startedAt: new Date().toISOString(),
  };

  const emit = (patch: Partial<DesignPipelineState>) => {
    Object.assign(state, patch);
    onProgress?.(structuredClone(state));
  };

  try {
    for (const step of plan.steps) {
      emit({ currentStep: step.order });

      // In production, this would dispatch to real tool executors.
      // For now, each step is logged and marked complete.
      await simulateStep(step);

      emit({
        completedSteps: [...state.completedSteps, step.order],
      });
    }

    emit({
      status: "complete",
      currentStep: undefined,
      completedAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    emit({
      status: "error",
      errors: [...state.errors, message],
      completedAt: new Date().toISOString(),
    });
  }

  return state;
}

// ─── Simulate a pipeline step (placeholder for real tool dispatch) ───────────

async function simulateStep(step: DesignPipelineStep): Promise<void> {
  // In production, this dispatches to the actual tool (ComfyUI API, CLI, etc.)
  // For now, simulate a short processing delay.
  await new Promise((resolve) => setTimeout(resolve, 50));
  console.log(
    `[DesignPipeline] Step ${step.order}: ${step.name} (${DESIGN_STACK_MAP[step.tool]?.name ?? step.tool})`,
  );
}

// ─── Get pipeline progress ───────────────────────────────────────────────────

export function getDesignPipelineProgress(state: DesignPipelineState): number {
  const total = state.plan.steps.length;
  if (state.status === "complete") return 100;
  if (state.status === "error" || total === 0) return 0;
  return Math.round((state.completedSteps.length / total) * 100);
}

// ─── Format response per the mandatory format ────────────────────────────────

export function formatPipelineResponse(plan: DesignPipelinePlan): string {
  const sections: string[] = [];
  const analysis = plan.analysis;
  const toolName = DESIGN_STACK_MAP[analysis.primaryTool]?.name ?? analysis.primaryTool;
  const secondaryNames = analysis.secondaryTools
    .map((id) => DESIGN_STACK_MAP[id]?.name ?? id)
    .join(", ");

  // 1. Objective
  sections.push(`### 1. Objectif\n${plan.brief.description}`);

  // 2. Tools
  sections.push(
    `### 2. Outils choisis\n- **Principal** : ${toolName}\n- **Secondaires** : ${secondaryNames}\n- **Mode** : ${selectDecisionMode(plan.brief)}`,
  );

  // 3. Steps
  const stepLines = plan.steps
    .map((s) => `${s.order}. **${s.name}** → ${DESIGN_STACK_MAP[s.tool]?.name ?? s.tool} — ${s.action}`)
    .join("\n");
  sections.push(`### 3. Étapes exactes\n${stepLines}`);

  // 4. Directories
  const dirLines = Object.entries(plan.directories)
    .map(([key, path]) => `- \`${key}\` → \`${path}\``)
    .join("\n");
  sections.push(`### 4. Dossiers à utiliser\n${dirLines}`);

  // 5. Naming
  sections.push(
    `### 5. Nommage\n- **Pattern** : \`${plan.naming.pattern}\`\n- **Exemple** : \`${plan.naming.example}\``,
  );

  // 6. Deliverables
  const delivLines = plan.deliverables
    .map((d) => `- \`${d.name}.${d.format}\` → \`${d.directory}\`${d.variant ? ` (${d.variant})` : ""}`)
    .join("\n");
  sections.push(`### 6. Sortie finale\n${delivLines}`);

  // 7. Quality
  const qaLines = plan.qualityChecks.map((c) => `- ✓ ${c}`).join("\n");
  sections.push(`### 7. Points de contrôle qualité\n${qaLines}`);

  // 8. Automation
  const autoLines = plan.automationNotes.map((n) => `- ${n}`).join("\n");
  sections.push(`### 8. Automatisation possible\n${autoLines}`);

  return sections.join("\n\n");
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function isVectorObjective(objective: string): boolean {
  return objective === "logo" || objective === "icon";
}

function needsBackgroundRemoval(objective: string): boolean {
  return (
    objective === "logo" ||
    objective === "icon" ||
    objective === "ecommerce" ||
    objective === "packaging"
  );
}
