import type {
  ProjectBrief,
  PipelineState,
  PipelineResults,
  AgentId,
} from "@/types";
import { uid } from "@/lib/utils";
import {
  runDirector,
  runStrategist,
  runBrandDesigner,
  runUIDesigner,
  runAssetGenerator,
  runCopywriter,
  runBuilder,
  runQAReviewer,
  runCritic,
  runOptimizer,
} from "@/agents";
import { saveResult } from "@/memory/store";

// ─── MattDESIGN.AI v3 — Core Pipeline Orchestrator ───────────────────────────

export type ProgressCallback = (state: PipelineState) => void;

/**
 * Run the full MattDESIGN.AI pipeline for a given brief.
 * Emits progress updates via the optional callback.
 */
export async function runPipeline(
  brief: ProjectBrief,
  onProgress?: ProgressCallback,
): Promise<PipelineState> {
  const state: PipelineState = {
    id: uid("pipeline"),
    brief,
    status: "running",
    currentAgent: undefined,
    completedAgents: [],
    results: {},
    startedAt: new Date().toISOString(),
    iteration: 1,
  };

  const emit = (patch: Partial<PipelineState>) => {
    Object.assign(state, patch);
    onProgress?.(structuredClone(state));
  };

  try {
    // ── Phase 1: Core agents ────────────────────────────────────────────────

    emit({ currentAgent: "director" });
    const directorResult = await runDirector(brief);
    emit({
      completedAgents: ["director"],
      results: { ...state.results, direction: directorResult.data },
    });

    emit({ currentAgent: "strategist" });
    const strategistResult = await runStrategist(brief, directorResult.data);
    emit({
      completedAgents: [...state.completedAgents, "strategist"],
      results: { ...state.results, strategy: strategistResult.data },
    });

    emit({ currentAgent: "brand-designer" });
    const brandResult = await runBrandDesigner(brief, directorResult.data);
    emit({
      completedAgents: [...state.completedAgents, "brand-designer"],
      results: { ...state.results, brand: brandResult.data },
    });

    emit({ currentAgent: "ui-designer" });
    const uiResult = await runUIDesigner(brief, brandResult.data, strategistResult.data);
    emit({
      completedAgents: [...state.completedAgents, "ui-designer"],
      results: { ...state.results, structure: uiResult.data },
    });

    emit({ currentAgent: "asset-generator" });
    const assetResult = await runAssetGenerator(brief, brandResult.data);
    emit({
      completedAgents: [...state.completedAgents, "asset-generator"],
      results: {
        ...state.results,
        assets: assetResult.data.assets,
        prompts: assetResult.data.prompts,
      },
    });

    emit({ currentAgent: "copywriter" });
    const copyResult = await runCopywriter(brief, brandResult.data, strategistResult.data);
    emit({
      completedAgents: [...state.completedAgents, "copywriter"],
      results: { ...state.results, copy: copyResult.data },
    });

    emit({ currentAgent: "builder" });
    const builderResult = await runBuilder(brief);
    emit({
      completedAgents: [...state.completedAgents, "builder"],
      results: {
        ...state.results,
        stack: builderResult.data.stack,
        executionPlan: builderResult.data.executionPlan,
      },
    });

    emit({ currentAgent: "qa-reviewer" });
    const qaResult = await runQAReviewer(state.results as Partial<PipelineResults>);
    emit({
      completedAgents: [...state.completedAgents, "qa-reviewer"],
    });

    // ── Phase 2: Self-improvement loop ──────────────────────────────────────

    emit({ status: "critiquing", currentAgent: "critic" });
    const criticResult = await runCritic(
      state.results as Partial<PipelineResults>,
      qaResult.data.overallScore,
    );
    emit({
      completedAgents: [...state.completedAgents, "critic"],
      critique: criticResult.data,
    });

    emit({ status: "optimizing", currentAgent: "optimizer" });
    const optimizerResult = await runOptimizer(
      state.results as Partial<PipelineResults>,
      criticResult.data,
    );
    emit({
      completedAgents: [...state.completedAgents, "optimizer"],
      improvement: optimizerResult.data,
    });

    // ── Phase 3: Finalise ────────────────────────────────────────────────────

    const finalScore =
      criticResult.data.overallScore + (optimizerResult.data?.scoreGain ?? 0);

    // Persist to memory
    saveResult(brief, state.results as Partial<PipelineResults>, finalScore);

    emit({
      status: "complete",
      currentAgent: undefined,
      completedAt: new Date().toISOString(),
    });
  } catch (err) {
    emit({
      status: "error",
      currentAgent: undefined,
      completedAt: new Date().toISOString(),
    });
    console.error("[Pipeline] Error:", err);
  }

  return state;
}

/**
 * Get the human-readable progress percentage for a pipeline state.
 */
export function getPipelineProgress(state: PipelineState): number {
  const totalAgents: AgentId[] = [
    "director", "strategist", "brand-designer", "ui-designer",
    "asset-generator", "copywriter", "builder", "qa-reviewer",
    "critic", "optimizer",
  ];
  if (state.status === "complete") return 100;
  if (state.status === "error") return 0;
  return Math.round((state.completedAgents.length / totalAgents.length) * 100);
}

/**
 * Get the current status label for display.
 */
export function getPipelineStatusLabel(state: PipelineState): string {
  const labels: Record<string, string> = {
    pending: "Waiting…",
    running: `Running — ${state.currentAgent ?? "initialising"}`,
    critiquing: "Critiquing output…",
    optimizing: "Optimizing…",
    complete: "Complete ✓",
    error: "Error ✗",
  };
  return labels[state.status] ?? state.status;
}
