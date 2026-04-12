import { NextResponse } from "next/server";
import {
  getEvents,
  getEventCounts,
  getFunnelStats,
  getAvgCriticScore,
} from "@/lib/analytics";

export async function GET() {
  try {
    const events = getEvents(200);
    const counts = getEventCounts();
    const funnel = getFunnelStats();
    const avgCriticScore = getAvgCriticScore();

    return NextResponse.json({
      events,
      counts,
      funnel,
      avgCriticScore,
    });
  } catch (err) {
    console.error("[API/analytics] Error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve analytics" },
      { status: 500 },
    );
  }
}
