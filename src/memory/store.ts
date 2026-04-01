import type { MemoryStore, MemoryEntry, SuccessPattern, PipelineResults, ProjectBrief } from "@/types";
import { uid } from "@/lib/utils";

// ─── In-memory store (server-side singleton / could be swapped for Supabase) ──

let _store: MemoryStore = {
  entries: [],
  patterns: [],
  lastUpdated: new Date().toISOString(),
};

// ─── Public API ───────────────────────────────────────────────────────────────

/** Return a snapshot of the full store */
export function getStore(): Readonly<MemoryStore> {
  return _store;
}

/** Save a successful pipeline result to memory */
export function saveResult(
  brief: ProjectBrief,
  results: Partial<PipelineResults>,
  score: number,
): MemoryEntry {
  const entry: MemoryEntry = {
    id: uid("mem"),
    type: "result",
    sector: brief.sector,
    tone: brief.tone,
    score,
    data: results,
    tags: buildTags(brief),
    createdAt: new Date().toISOString(),
    usedCount: 0,
  };

  _store = {
    ..._store,
    entries: [..._store.entries, entry],
    lastUpdated: new Date().toISOString(),
  };

  // Extract pattern if score is high
  if (score >= 75) {
    extractPattern(brief, results, score);
  }

  return entry;
}

/** Recall the best matching past result for a brief */
export function recall(brief: Partial<ProjectBrief>): MemoryEntry | null {
  const candidates = _store.entries
    .filter((e) => e.type === "result" && e.score >= 70)
    .filter((e) => {
      if (brief.sector && e.sector && e.sector !== brief.sector) return false;
      if (brief.tone && e.tone && e.tone !== brief.tone) return false;
      return true;
    })
    .sort((a, b) => b.score - a.score || b.usedCount - a.usedCount);

  const best = candidates[0] ?? null;

  if (best) {
    // Mark as used
    _store = {
      ..._store,
      entries: _store.entries.map((e) =>
        e.id === best.id ? { ...e, usedCount: e.usedCount + 1 } : e,
      ),
    };
  }

  return best;
}

/** Get the best success pattern for a brief */
export function getBestPattern(brief: Partial<ProjectBrief>): SuccessPattern | null {
  const matches = _store.patterns
    .filter((p) => {
      const c = p.conditions;
      if (c.sector && c.sector !== brief.sector) return false;
      if (c.tone && c.tone !== brief.tone) return false;
      return true;
    })
    .sort((a, b) => b.avgScore - a.avgScore);

  return matches[0] ?? null;
}

/** Save explicit feedback */
export function saveFeedback(data: { id: string; score: number; comment: string }): void {
  const entry: MemoryEntry = {
    id: uid("fb"),
    type: "feedback",
    score: data.score,
    data,
    tags: [],
    createdAt: new Date().toISOString(),
    usedCount: 0,
  };
  _store = {
    ..._store,
    entries: [..._store.entries, entry],
    lastUpdated: new Date().toISOString(),
  };
}

/** Get memory stats */
export function getStats(): {
  totalEntries: number;
  avgScore: number;
  topSectors: string[];
  patternCount: number;
} {
  const results = _store.entries.filter((e) => e.type === "result");
  const avgScore =
    results.length > 0
      ? results.reduce((s, e) => s + e.score, 0) / results.length
      : 0;

  const sectorCounts: Record<string, number> = {};
  for (const e of results) {
    if (e.sector) sectorCounts[e.sector] = (sectorCounts[e.sector] ?? 0) + 1;
  }
  const topSectors = Object.entries(sectorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  return {
    totalEntries: _store.entries.length,
    avgScore: Math.round(avgScore),
    topSectors,
    patternCount: _store.patterns.length,
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function buildTags(brief: ProjectBrief): string[] {
  const tags: string[] = [];
  if (brief.sector) tags.push(brief.sector);
  if (brief.tone) tags.push(brief.tone);
  if (brief.style) tags.push(brief.style);
  if (brief.lang) tags.push(brief.lang);
  return tags;
}

function extractPattern(
  brief: ProjectBrief,
  results: Partial<PipelineResults>,
  score: number,
): void {
  const existing = _store.patterns.find(
    (p) => p.conditions.sector === brief.sector && p.conditions.tone === brief.tone,
  );

  if (existing) {
    // Update average
    _store = {
      ..._store,
      patterns: _store.patterns.map((p) =>
        p.id === existing.id
          ? {
              ...p,
              avgScore: Math.round((p.avgScore * p.usageCount + score) / (p.usageCount + 1)),
              usageCount: p.usageCount + 1,
              template: results,
            }
          : p,
      ),
    };
  } else {
    const pattern: SuccessPattern = {
      id: uid("pat"),
      description: `${brief.sector ?? "generic"} × ${brief.tone ?? "neutral"} pattern`,
      conditions: { sector: brief.sector, tone: brief.tone, style: brief.style },
      template: results,
      avgScore: score,
      usageCount: 1,
    };
    _store = {
      ..._store,
      patterns: [..._store.patterns, pattern],
    };
  }
}
