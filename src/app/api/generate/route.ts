import { type NextRequest } from "next/server";
import type { ProjectBrief } from "@/types";
import { runPipeline } from "@/core/orchestrator";
import { projectBriefSchema } from "@/lib/schemas";
import { trackEvent } from "@/lib/analytics";

// ─── MattDESIGN.AI — Generate API Route (SSE Streaming) ──────────────────────
// POST /api/generate
// Streams PipelineState updates as Server-Sent Events.
// Each agent completion fires a `data: {...}\n\n` event.
// Final event has status: "complete" | "error".

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest): Promise<Response> {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = projectBriefSchema.safeParse(rawBody);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "Validation failed",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const brief: ProjectBrief = {
    ...parsed.data,
    tone: parsed.data.tone ?? "professional",
    goals: parsed.data.goals ?? [],
    competitors: parsed.data.competitors ?? [],
    lang: parsed.data.lang ?? "en",
  };

  trackEvent("generation_started", {
    projectName: brief.projectName,
    sector: brief.sector,
    tone: brief.tone,
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          // Controller may already be closed
        }
      };

      try {
        const result = await runPipeline(brief, send);
        trackEvent(
          result.status === "complete"
            ? "generation_completed"
            : "generation_failed",
          {
            projectName: brief.projectName,
            pipelineId: result.id,
            status: result.status,
          },
        );
      } catch (err) {
        console.error("[API /generate]", err);
        trackEvent("generation_failed", {
          projectName: brief.projectName,
          error: String(err),
        });
        send({ status: "error", error: "Pipeline failed" });
      } finally {
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
