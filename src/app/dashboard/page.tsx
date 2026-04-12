"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, Badge, Button, ScoreRing, Progress } from "@/components/ui";
import type { MemoryEntry, SuccessPattern } from "@/types";
import {
  Layers,
  Brain,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Database,
  Star,
} from "lucide-react";

// ─── Dashboard Page ──────────────────────────────────────────────────────────

interface MemoryStats {
  totalEntries: number;
  avgScore: number;
  topSectors: string[];
  patternCount: number;
}

interface MemoryData {
  stats: MemoryStats;
  entries: MemoryEntry[];
  patterns: SuccessPattern[];
  lastUpdated: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<MemoryData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/memory");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white md-heading">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Project memory, patterns, and generation history
            </p>
          </div>
          <Link href="/generate">
            <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
              New Project
            </Button>
          </Link>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : !data ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Layers className="h-5 w-5 text-blue-400" />}
                label="Total Generations"
                value={data.stats.totalEntries}
                color="blue"
              />
              <StatCard
                icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
                label="Average Score"
                value={data.stats.avgScore}
                suffix="/100"
                color="accent"
              />
              <StatCard
                icon={<Brain className="h-5 w-5 text-violet-400" />}
                label="Learned Patterns"
                value={data.stats.patternCount}
                color="violet"
              />
              <StatCard
                icon={<Database className="h-5 w-5 text-slate-400" />}
                label="Top Sectors"
                value={data.stats.topSectors.length > 0 ? data.stats.topSectors.join(", ") : "—"}
                isText
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent generations */}
              <div className="lg:col-span-2">
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Recent Generations</h2>
                    <Badge variant="muted">
                      {data.entries.filter((e) => e.type === "result").length} runs
                    </Badge>
                  </div>

                  {data.entries.filter((e) => e.type === "result").length === 0 ? (
                    <div className="text-center py-8">
                      <Sparkles className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">No generations yet</p>
                      <p className="text-slate-500 text-xs mt-1">
                        Create your first project to see results here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.entries
                        .filter((e) => e.type === "result")
                        .slice(0, 10)
                        .map((entry) => (
                          <EntryRow key={entry.id} entry={entry} />
                        ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Success patterns */}
              <div>
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Success Patterns</h2>
                    <Badge variant="accent">{data.patterns.length}</Badge>
                  </div>

                  {data.patterns.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">No patterns learned yet</p>
                      <p className="text-slate-500 text-xs mt-1">
                        Patterns emerge from high-scoring generations (75+)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.patterns.map((pattern) => (
                        <PatternRow key={pattern.id} pattern={pattern} />
                      ))}
                    </div>
                  )}
                </Card>

                {/* Memory health */}
                <Card className="mt-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Memory Health</h3>
                  <div className="space-y-3">
                    <Progress
                      label="Capacity"
                      value={Math.min(data.stats.totalEntries, 100)}
                      max={100}
                      showValue
                      variant="default"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Last updated</span>
                      <span className="text-slate-400">
                        {data.lastUpdated
                          ? new Date(data.lastUpdated).toLocaleString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  suffix,
  color = "blue",
  isText,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  color?: "blue" | "violet" | "accent";
  isText?: boolean;
}) {
  const glowMap = { blue: "blue", violet: "violet", accent: "accent" } as const;
  return (
    <Card glow={glowMap[color] ?? "none"}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          {isText ? (
            <p className="text-sm font-medium text-white mt-0.5">
              {value}
            </p>
          ) : (
            <p className="text-xl font-bold text-white tabular-nums mt-0.5">
              {value}
              {suffix && (
                <span className="text-sm font-normal text-slate-500">
                  {suffix}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function EntryRow({ entry }: { entry: MemoryEntry }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-[#1E293B] hover:border-blue-500/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <ScoreRing score={entry.score} size={36} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {entry.sector && <Badge variant="default">{entry.sector}</Badge>}
            {entry.tone && <Badge variant="violet">{entry.tone}</Badge>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Clock className="h-3 w-3 text-slate-600" />
            <span className="text-xs text-slate-500">
              {new Date(entry.createdAt).toLocaleDateString()}
            </span>
            {entry.usedCount > 0 && (
              <span className="text-xs text-slate-600">
                · used {entry.usedCount}×
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {entry.tags.map((tag) => (
          <span key={tag} className="text-xs text-slate-600">{tag}</span>
        ))}
      </div>
    </div>
  );
}

function PatternRow({ pattern }: { pattern: SuccessPattern }) {
  return (
    <div className="py-2 px-3 rounded-lg border border-[#1E293B]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-white">{pattern.description}</span>
        <Badge variant="accent">{pattern.avgScore}</Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>Used {pattern.usageCount}×</span>
        {pattern.conditions.sector && (
          <span>· {pattern.conditions.sector}</span>
        )}
        {pattern.conditions.tone && (
          <span>· {pattern.conditions.tone}</span>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-[#111827] border border-[#1E293B] animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 rounded-xl bg-[#111827] border border-[#1E293B] animate-pulse" />
        <div className="h-64 rounded-xl bg-[#111827] border border-[#1E293B] animate-pulse" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24">
      <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">
        Welcome to MattDESIGN.AI
      </h2>
      <p className="text-slate-400 max-w-md mx-auto mb-6">
        Your dashboard will show generation history, learned patterns, and
        quality metrics once you start creating projects.
      </p>
      <Link href="/generate">
        <Button variant="primary" size="lg">
          Create Your First Project →
        </Button>
      </Link>
    </div>
  );
}
