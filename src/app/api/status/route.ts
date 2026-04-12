import { type NextRequest, NextResponse } from "next/server";
import { hasClaudeKey } from "@/lib/claude";

// ─── GET /api/status ──────────────────────────────────────────────────────────
// Returns platform status: whether Claude is configured, pipeline mode, version.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(_request: NextRequest) {
  const claudeReady = hasClaudeKey();
  return NextResponse.json({
    version: "3.0.0",
    pipeline: {
      mode: claudeReady ? "ai" : "demo",
      claudeConfigured: claudeReady,
      model: claudeReady ? "claude-sonnet-4-6" : null,
    },
    agents: 10,
    streaming: true,
  });
}
