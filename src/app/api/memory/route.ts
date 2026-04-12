import { NextResponse } from "next/server";
import { getStore, getStats } from "@/memory/store";

export async function GET() {
  try {
    const store = getStore();
    const stats = getStats();

    return NextResponse.json({
      stats,
      entries: store.entries.slice(-50).reverse(),
      patterns: store.patterns,
      lastUpdated: store.lastUpdated,
    });
  } catch (err) {
    console.error("[API/memory] Error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve memory data" },
      { status: 500 },
    );
  }
}
