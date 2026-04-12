"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Badge, Button, ScoreRing, Progress } from "@/components/ui";
import type { MemoryEntry, SuccessPattern } from "@/types";
import type { AnalyticsEvent } from "@/lib/analytics";
import {
  Activity,
  BarChart3,
  ShieldCheck,
  Eye,
  Zap,
  AlertTriangle,
  TrendingUp,
  Clock,
  RefreshCw,
} from "lucide-react";

// ─── Admin Page — Internal QA & Operations ───────────────────────────────────

interface AdminData {
  memory: {
    stats: { totalEntries: number; avgScore: number; topSectors: string[]; patternCount: number };
    entries: MemoryEntry[];
    patterns: SuccessPattern[];
  };
  analytics: {
    events: AnalyticsEvent[];
    counts: Record<string, number>;
    funnel: {
      visits: number;
      briefsStarted: number;
      briefsSubmitted: number;
      generationsStarted: number;
      generationsCompleted: number;
      exports: number;
      conversionRate: number;
    };
    avgCriticScore: number;
  };
}

type AdminTab = "overview" | "funnel" | "quality" | "memory" | "events";

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [memRes, analyticsRes] = await Promise.all([
        fetch("/api/memory"),
        fetch("/api/analytics"),
      ]);

      const memory = memRes.ok ? await memRes.json() : null;
      const analytics = analyticsRes.ok ? await analyticsRes.json() : null;

      if (memory && analytics) {
        setData({ memory, analytics });
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "funnel", label: "Funnel", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "quality", label: "Quality", icon: <Eye className="h-4 w-4" /> },
    { id: "memory", label: "Memory", icon: <Zap className="h-4 w-4" /> },
    { id: "events", label: "Events", icon: <Activity className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white md-heading">Admin</h1>
              <Badge variant="warning">Internal</Badge>
            </div>
            <p className="text-slate-400 mt-1">
              Operations, quality metrics, and system health
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
          >
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[#1E293B] pb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#111827] text-white border-b-2 border-blue-500"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <AdminSkeleton />
        ) : !data ? (
          <Card className="text-center py-12">
            <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <p className="text-slate-400">Failed to load admin data</p>
          </Card>
        ) : (
          <>
            {activeTab === "overview" && <OverviewTab data={data} />}
            {activeTab === "funnel" && <FunnelTab data={data} />}
            {activeTab === "quality" && <QualityTab data={data} />}
            {activeTab === "memory" && <MemoryTab data={data} />}
            {activeTab === "events" && <EventsTab data={data} />}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ data }: { data: AdminData }) {
  const { memory, analytics } = data;

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Generations" value={memory.stats.totalEntries} />
        <MetricCard label="Avg Score" value={memory.stats.avgScore} suffix="/100" />
        <MetricCard label="Patterns" value={memory.stats.patternCount} />
        <MetricCard label="Critic Avg" value={analytics.avgCriticScore} suffix="/100" />
        <MetricCard label="Exports" value={analytics.funnel.exports} />
        <MetricCard label="Conversion" value={analytics.funnel.conversionRate} suffix="%" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event counts */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Event Distribution</h3>
          {Object.entries(analytics.counts).length === 0 ? (
            <p className="text-sm text-slate-500">No events recorded yet</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(analytics.counts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([name, count]) => {
                  const maxCount = Math.max(
                    ...Object.values(analytics.counts),
                  );
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-40 truncate">
                        {name}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-[#1E293B] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
                          style={{
                            width: `${(count / maxCount) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 tabular-nums w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>

        {/* System status */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">System Status</h3>
          <div className="space-y-3">
            <StatusRow
              label="Memory Store"
              status={memory.stats.totalEntries >= 0 ? "healthy" : "error"}
              detail={`${memory.stats.totalEntries} entries`}
            />
            <StatusRow
              label="Analytics"
              status="healthy"
              detail={`${analytics.events.length} events tracked`}
            />
            <StatusRow
              label="Pattern Engine"
              status={memory.stats.patternCount > 0 ? "healthy" : "idle"}
              detail={`${memory.stats.patternCount} patterns`}
            />
            <StatusRow
              label="Claude API"
              status="unknown"
              detail="Check env var"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Funnel Tab ───────────────────────────────────────────────────────────────

function FunnelTab({ data }: { data: AdminData }) {
  const { funnel } = data.analytics;
  const maxVal = Math.max(
    funnel.visits,
    funnel.briefsStarted,
    funnel.briefsSubmitted,
    funnel.generationsStarted,
    funnel.generationsCompleted,
    funnel.exports,
    1,
  );

  const steps = [
    { label: "Page Views", value: funnel.visits, color: "from-slate-500 to-slate-400" },
    { label: "Briefs Started", value: funnel.briefsStarted, color: "from-blue-600 to-blue-400" },
    { label: "Briefs Submitted", value: funnel.briefsSubmitted, color: "from-blue-500 to-violet-500" },
    { label: "Generations Started", value: funnel.generationsStarted, color: "from-violet-500 to-violet-400" },
    { label: "Generations Completed", value: funnel.generationsCompleted, color: "from-emerald-500 to-emerald-400" },
    { label: "Exports", value: funnel.exports, color: "from-amber-500 to-amber-400" },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Conversion Funnel</h3>
        <Badge variant="accent">{funnel.conversionRate}% conversion</Badge>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">{step.label}</span>
              <span className="text-sm font-medium text-white tabular-nums">
                {step.value}
              </span>
            </div>
            <div className="h-8 rounded-lg bg-[#0A0F1E] overflow-hidden">
              <div
                className={`h-full rounded-lg bg-gradient-to-r ${step.color} transition-all duration-700 flex items-center justify-end pr-3`}
                style={{
                  width: `${maxVal > 0 ? Math.max((step.value / maxVal) * 100, 2) : 2}%`,
                }}
              >
                {step.value > 0 && (
                  <span className="text-xs font-medium text-white/80">
                    {i > 0 && steps[i - 1].value > 0
                      ? `${Math.round((step.value / steps[i - 1].value) * 100)}%`
                      : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Quality Tab ──────────────────────────────────────────────────────────────

function QualityTab({ data }: { data: AdminData }) {
  const results = data.memory.entries.filter((e) => e.type === "result");
  const scores = results.map((e) => e.score);
  const excellent = scores.filter((s) => s >= 80).length;
  const good = scores.filter((s) => s >= 60 && s < 80).length;
  const weak = scores.filter((s) => s < 60).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card glow="accent">
          <div className="text-center">
            <ScoreRing score={data.analytics.avgCriticScore || data.memory.stats.avgScore} size={80} />
            <p className="text-sm text-slate-400 mt-2">Average Critic Score</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Score Distribution</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-400">Excellent (80+)</span>
              <span className="text-xs text-white tabular-nums">{excellent}</span>
            </div>
            <Progress value={excellent} max={Math.max(results.length, 1)} variant="accent" size="sm" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-400">Good (60-79)</span>
              <span className="text-xs text-white tabular-nums">{good}</span>
            </div>
            <Progress value={good} max={Math.max(results.length, 1)} variant="default" size="sm" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400">Weak (&lt;60)</span>
              <span className="text-xs text-white tabular-nums">{weak}</span>
            </div>
            <Progress value={weak} max={Math.max(results.length, 1)} variant="violet" size="sm" />
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Quality Rules</h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
              Score ≥75 triggers pattern extraction
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
              Critic scores 6 dimensions
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
              Optimizer fixes weak points
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
              Memory learns from success
            </li>
          </ul>
        </Card>
      </div>

      {/* Recent scores */}
      {results.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Recent Scores</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {results.slice(0, 16).map((entry) => (
              <div
                key={entry.id}
                className="text-center py-2 px-1 rounded-lg bg-[#0A0F1E] border border-[#1E293B]"
              >
                <ScoreRing score={entry.score} size={36} />
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {entry.sector ?? "general"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Memory Tab ───────────────────────────────────────────────────────────────

function MemoryTab({ data }: { data: AdminData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Memory Entries</h3>
          <div className="space-y-2">
            {data.memory.entries.length === 0 ? (
              <p className="text-sm text-slate-500">No entries yet</p>
            ) : (
              data.memory.entries.slice(0, 20).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded border border-[#1E293B] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={entry.type === "result" ? "default" : entry.type === "feedback" ? "accent" : "violet"}>
                      {entry.type}
                    </Badge>
                    {entry.sector && (
                      <span className="text-slate-400">{entry.sector}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{entry.score}</span>
                    <Clock className="h-3 w-3 text-slate-600" />
                    <span className="text-slate-600">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Learned Patterns</h3>
          {data.memory.patterns.length === 0 ? (
            <p className="text-sm text-slate-500">
              No patterns learned yet. Generate projects with scores above 75 to start learning.
            </p>
          ) : (
            <div className="space-y-3">
              {data.memory.patterns.map((pattern) => (
                <div key={pattern.id} className="p-3 rounded-lg border border-[#1E293B]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">
                      {pattern.description}
                    </span>
                    <ScoreRing score={pattern.avgScore} size={32} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Used {pattern.usageCount}× ·{" "}
                    {pattern.conditions.sector ?? "any"} sector ·{" "}
                    {pattern.conditions.tone ?? "any"} tone
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── Events Tab ───────────────────────────────────────────────────────────────

function EventsTab({ data }: { data: AdminData }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Recent Events</h3>
        <Badge variant="muted">{data.analytics.events.length} events</Badge>
      </div>

      {data.analytics.events.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          No events recorded yet. Events are tracked as users interact with the system.
        </p>
      ) : (
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {data.analytics.events.slice(0, 100).map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 py-1.5 px-2 rounded text-xs hover:bg-white/5 transition-colors"
            >
              <span className="text-slate-600 tabular-nums w-20 flex-shrink-0">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
              <Badge
                variant={
                  event.name.includes("completed")
                    ? "success"
                    : event.name.includes("failed")
                      ? "danger"
                      : event.name.includes("started")
                        ? "default"
                        : "muted"
                }
              >
                {event.name}
              </Badge>
              <span className="text-slate-500 truncate">
                {Object.entries(event.properties)
                  .slice(0, 3)
                  .map(([k, v]) => `${k}: ${String(v)}`)
                  .join(" · ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <Card className="text-center">
      <p className="text-2xl font-bold text-white tabular-nums">
        {value}
        {suffix && <span className="text-sm font-normal text-slate-500">{suffix}</span>}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </Card>
  );
}

function StatusRow({
  label,
  status,
  detail,
}: {
  label: string;
  status: "healthy" | "error" | "idle" | "unknown";
  detail: string;
}) {
  const colors = {
    healthy: "bg-green-400",
    error: "bg-red-400",
    idle: "bg-amber-400",
    unknown: "bg-slate-500",
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${colors[status]}`} />
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <span className="text-xs text-slate-500">{detail}</span>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-[#111827] border border-[#1E293B] animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-48 rounded-xl bg-[#111827] border border-[#1E293B] animate-pulse" />
        <div className="h-48 rounded-xl bg-[#111827] border border-[#1E293B] animate-pulse" />
      </div>
    </div>
  );
}
