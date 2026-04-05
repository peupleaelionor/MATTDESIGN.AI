import { type NextRequest } from "next/server";
import type { ProjectBrief } from "@/types";
import { runPipeline } from "@/core/orchestrator";

// ─── MattDESIGN.AI — Generate API Route (SSE Streaming) ──────────────────────
// POST /api/generate
// Streams PipelineState updates as Server-Sent Events.
// Each agent completion fires a `data: {...}\n\n` event.
// Final event has status: "complete" | "error".

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest): Promise<Response> {
  let body: Partial<ProjectBrief>;

  try {
    body = (await request.json()) as Partial<ProjectBrief>;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.projectName?.trim()) {
    return new Response(JSON.stringify({ error: "projectName is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!body.description?.trim()) {
    return new Response(JSON.stringify({ error: "description is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const brief: ProjectBrief = {
    projectName: body.projectName.trim(),
    description: body.description.trim(),
    sector: body.sector?.trim(),
    audience: body.audience?.trim(),
    style: body.style?.trim(),
    tone: body.tone ?? "professional",
    goals: body.goals ?? [],
    competitors: body.competitors ?? [],
    constraints: body.constraints?.trim(),
    lang: body.lang ?? "en",
  };

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
        await runPipeline(brief, send);
      } catch (err) {
        console.error("[API /generate]", err);
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
