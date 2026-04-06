import { type NextRequest } from "next/server";
import type { CreativeBrief } from "@/types/design-pipeline";
import {
  planDesignPipeline,
  executeDesignPipeline,
  formatPipelineResponse,
} from "@/core/design-orchestrator";

// ─── MattDESIGN.AI — Design Pipeline API Route (SSE Streaming) ───────────────
// POST /api/design-pipeline
// Accepts a CreativeBrief, plans the pipeline, then streams execution progress.

export const runtime = "nodejs";
export const maxDuration = 120;

const VALID_OBJECTIVE_TYPES = [
  "logo", "brand-kit", "social-post", "website", "mockup",
  "ecommerce", "poster", "icon", "packaging", "retouche",
  "illustration", "photo-editing",
] as const;

const VALID_LEVELS = ["simple", "standard", "premium"] as const;

const VALID_VARIANT_STYLES = ["clean", "premium", "bold", "minimal", "commercial"] as const;

export async function POST(request: NextRequest): Promise<Response> {
  let body: Partial<CreativeBrief>;

  try {
    body = (await request.json()) as Partial<CreativeBrief>;
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  // ── Validate required fields ────────────────────────────────────────────
  if (!body.projectName?.trim()) {
    return jsonError("projectName is required", 400);
  }
  if (!body.description?.trim()) {
    return jsonError("description is required", 400);
  }
  if (!body.objectiveType || !VALID_OBJECTIVE_TYPES.includes(body.objectiveType)) {
    return jsonError(
      `objectiveType is required and must be one of: ${VALID_OBJECTIVE_TYPES.join(", ")}`,
      400,
    );
  }

  // ── Build validated brief ───────────────────────────────────────────────
  const brief: CreativeBrief = {
    projectName: body.projectName.trim(),
    description: body.description.trim(),
    objectiveType: body.objectiveType,
    referenceImages: body.referenceImages ?? [],
    structureLocked: body.structureLocked ?? false,
    needsMask: body.needsMask ?? false,
    needsVector: body.needsVector ?? false,
    targetFormats: body.targetFormats ?? ["png"],
    level: VALID_LEVELS.includes(body.level as typeof VALID_LEVELS[number])
      ? body.level!
      : "standard",
    variants: body.variants?.filter((v): v is typeof VALID_VARIANT_STYLES[number] =>
      VALID_VARIANT_STYLES.includes(v as typeof VALID_VARIANT_STYLES[number]),
    ),
    constraints: body.constraints?.trim(),
    lang: body.lang === "fr" ? "fr" : "en",
  };

  // ── Plan ────────────────────────────────────────────────────────────────
  let plan;
  try {
    plan = planDesignPipeline(brief);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Pipeline planning failed";
    return jsonError(message, 500);
  }

  // ── Stream execution ───────────────────────────────────────────────────
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Controller may already be closed
        }
      };

      // Send the plan first
      send({
        type: "plan",
        plan: {
          id: plan.id,
          analysis: plan.analysis,
          steps: plan.steps,
          directories: plan.directories,
          naming: plan.naming,
          deliverables: plan.deliverables,
          qualityChecks: plan.qualityChecks,
          automationNotes: plan.automationNotes,
        },
        formattedResponse: formatPipelineResponse(plan),
      });

      // Execute and stream progress
      try {
        await executeDesignPipeline(plan, (state) => {
          send({
            type: "progress",
            state: {
              id: state.id,
              status: state.status,
              currentStep: state.currentStep,
              completedSteps: state.completedSteps,
              errors: state.errors,
            },
          });
        });
      } catch (err) {
        console.error("[API /design-pipeline]", err);
        send({ type: "error", error: "Pipeline execution failed" });
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
