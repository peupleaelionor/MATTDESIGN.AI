import { type NextRequest, NextResponse } from "next/server";
import type { ProjectBrief } from "@/types";
import { runPipeline } from "@/core/orchestrator";

// ─── MattDESIGN.AI v3 — Generate API Route ───────────────────────────────────
// POST /api/generate
// Body: ProjectBrief
// Response: PipelineState (JSON) or streaming (future)

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Partial<ProjectBrief>;

    // Validate required fields
    if (!body.projectName?.trim()) {
      return NextResponse.json(
        { error: "projectName is required" },
        { status: 400 },
      );
    }
    if (!body.description?.trim()) {
      return NextResponse.json(
        { error: "description is required" },
        { status: 400 },
      );
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

    const finalState = await runPipeline(brief);

    return NextResponse.json(finalState, { status: 200 });
  } catch (err) {
    console.error("[API /generate]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const maxDuration = 60;
