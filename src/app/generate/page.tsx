"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  Badge,
  Progress,
  ScoreRing,
} from "@/components/ui";
import type { ProjectBrief, PipelineState } from "@/types";
import { AGENT_CONFIGS } from "@/config/agent-config";
import { AgentIcon } from "@/components/agent-icon";
import { cn } from "@/lib/utils";

// ─── Generate Page ────────────────────────────────────────────────────────────

type Step = "brief" | "generating" | "results";

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "bold", label: "Bold" },
  { value: "minimal", label: "Minimal" },
  { value: "luxury", label: "Luxury" },
  { value: "playful", label: "Playful" },
];

const LANG_OPTIONS = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];

type PipelineMode = "ai" | "demo" | null;

export default function GeneratePage() {
  const [step, setStep] = useState<Step>("brief");
  const [brief, setBrief] = useState<Partial<ProjectBrief>>({
    tone: "professional",
    lang: "en",
  });
  const [pipeline, setPipeline] = useState<PipelineState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("brand");
  const [mode, setMode] = useState<PipelineMode>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => setMode(d?.pipeline?.mode ?? "demo"))
      .catch(() => setMode("demo"));
  }, []);

  // ── Validation ────────────────────────────────────────────────────────────

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!brief.projectName?.trim()) next.projectName = "Project name is required";
    if (!brief.description?.trim()) next.description = "Description is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Stream handler ────────────────────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    if (!validate()) return;

    abortRef.current = new AbortController();
    setStep("generating");
    setPipeline(null);
    setErrors({});

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Stream unavailable");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const state = JSON.parse(line.slice(6)) as PipelineState;
            setPipeline(state);
            if (state.status === "complete") {
              setStep("results");
              return;
            }
            if (state.status === "error") {
              throw new Error("Pipeline error");
            }
          } catch (parseErr) {
            // Skip malformed events
          }
        }
      }

      // If stream ends without complete status, check last state
      setPipeline((prev) => {
        if (prev && prev.status !== "complete") {
          const updated = { ...prev, status: "complete" as const };
          setStep("results");
          return updated;
        }
        return prev;
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("[Generate]", err);
      setErrors({ submit: "Something went wrong. Please try again." });
      setStep("brief");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brief]);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setStep("brief");
    setPipeline(null);
    setErrors({});
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="accent" dot>Generator</Badge>
            {mode === "ai" && (
              <Badge variant="default" dot>AI mode — Claude active</Badge>
            )}
            {mode === "demo" && (
              <Badge variant="muted">Demo mode</Badge>
            )}
          </div>
          <h1 className="md-heading text-3xl md:text-4xl text-white">
            Generate your{" "}
            <span className="md-gradient-text">premium project</span>
          </h1>
          <p className="mt-3 text-slate-400 max-w-lg">
            {mode === "demo"
              ? "Running in demo mode — add ANTHROPIC_API_KEY to enable real AI generation."
              : "Fill in the brief. The pipeline does the rest."}
          </p>
          {mode === "demo" && (
            <a href="/docs#configuration" className="mt-2 text-xs text-blue-400 hover:underline">
              Learn how to enable AI mode →
            </a>
          )}
        </div>

        {step === "brief" && (
          <BriefForm
            brief={brief}
            errors={errors}
            onChange={(patch) => setBrief((prev) => ({ ...prev, ...patch }))}
            onSubmit={handleGenerate}
          />
        )}

        {step === "generating" && (
          <GeneratingView pipeline={pipeline} brief={brief} />
        )}

        {step === "results" && pipeline && (
          <ResultsView
            pipeline={pipeline}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}

// ─── Brief Form ───────────────────────────────────────────────────────────────

function BriefForm({
  brief,
  errors,
  onChange,
  onSubmit,
}: {
  brief: Partial<ProjectBrief>;
  errors: Record<string, string>;
  onChange: (patch: Partial<ProjectBrief>) => void;
  onSubmit: () => void;
}) {
  return (
    <Card className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#1E293B]">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            01
          </div>
          <div>
            <h2 className="font-semibold text-white">Project Brief</h2>
            <p className="text-xs text-slate-500">Even a sentence is enough to start</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Project name *"
              placeholder="e.g. Acme Studio"
              value={brief.projectName ?? ""}
              onChange={(e) => onChange({ projectName: e.target.value })}
              error={errors.projectName}
            />
          </div>

          <div className="sm:col-span-2">
            <Textarea
              label="What does it do? *"
              placeholder="Describe your project in one sentence — what it is, who it's for…"
              value={brief.description ?? ""}
              onChange={(e) => onChange({ description: e.target.value })}
              error={errors.description}
              rows={3}
            />
          </div>

          <Input
            label="Sector"
            placeholder="e.g. SaaS, e-commerce, agency"
            value={brief.sector ?? ""}
            onChange={(e) => onChange({ sector: e.target.value })}
          />

          <Input
            label="Target audience"
            placeholder="e.g. B2B decision-makers"
            value={brief.audience ?? ""}
            onChange={(e) => onChange({ audience: e.target.value })}
          />

          <Select
            label="Tone"
            options={TONE_OPTIONS}
            value={brief.tone ?? "professional"}
            onChange={(e) => onChange({ tone: e.target.value as ProjectBrief["tone"] })}
          />

          <Select
            label="Language"
            options={LANG_OPTIONS}
            value={brief.lang ?? "en"}
            onChange={(e) => onChange({ lang: e.target.value as ProjectBrief["lang"] })}
          />

          <div className="sm:col-span-2">
            <Input
              label="Visual style"
              placeholder="e.g. dark UI, editorial, minimal, glassmorphism"
              value={brief.style ?? ""}
              onChange={(e) => onChange({ style: e.target.value })}
            />
          </div>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-400 text-center">{errors.submit}</p>
        )}

        <Button
          size="lg"
          variant="primary"
          className="w-full md-glow-blue"
          onClick={onSubmit}
        >
          Generate →
        </Button>

        <p className="text-center text-xs text-slate-600">
          Free · Open-source · No account required
        </p>
      </div>
    </Card>
  );
}

// ─── Generating View — Live streaming progress ────────────────────────────────

function GeneratingView({
  pipeline,
  brief,
}: {
  pipeline: PipelineState | null;
  brief: Partial<ProjectBrief>;
}) {
  const completed = pipeline?.completedAgents ?? [];
  const current = pipeline?.currentAgent;
  const progress = pipeline
    ? Math.round((completed.length / 10) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Status card */}
      <Card className="text-center py-8">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">
              Generating{" "}
              <span className="text-blue-400">{brief.projectName}</span>
            </h2>
            <p className="text-sm text-slate-400">
              {current
                ? `${AGENT_CONFIGS.find((a) => a.id === current)?.name ?? current} is running…`
                : completed.length === 10
                ? "Pipeline complete ✓"
                : "Initialising pipeline…"}
            </p>
          </div>
          <Progress
            value={progress}
            showValue
            label="Pipeline progress"
            className="w-full max-w-xs"
          />
        </div>
      </Card>

      {/* Agent status list */}
      <div className="space-y-1.5">
        {AGENT_CONFIGS.map((agent) => {
          const isDone = completed.includes(agent.id as never);
          const isRunning = current === agent.id;
          const isPending = !isDone && !isRunning;

          return (
            <div
              key={agent.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-all duration-300",
                isRunning && "border-blue-500/50 bg-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
                isDone && "border-[#1E293B] bg-[#111827]/60",
                isPending && "border-[#1E293B]/40 bg-transparent opacity-30",
              )}
            >
              <AgentIcon name={agent.icon} className="size-5" style={{ color: agent.color }} />
              <span className={cn(
                "text-sm font-medium flex-1",
                isRunning ? "text-white" : isDone ? "text-slate-300" : "text-slate-600",
              )}>
                {agent.name}
              </span>
              <span className={cn(
                "text-xs font-medium",
                isRunning ? "text-blue-400 animate-pulse" : isDone ? "text-emerald-400" : "text-slate-700",
              )}>
                {isRunning ? "Running…" : isDone ? "Done ✓" : "Waiting"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Results View ─────────────────────────────────────────────────────────────

const RESULT_TABS = [
  { id: "brand", label: "Brand DNA" },
  { id: "structure", label: "Structure" },
  { id: "copy", label: "Copy" },
  { id: "assets", label: "Assets" },
  { id: "stack", label: "Stack" },
  { id: "qa", label: "QA Report" },
];

function ResultsView({
  pipeline,
  activeTab,
  onTabChange,
  onReset,
}: {
  pipeline: PipelineState;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onReset: () => void;
}) {
  const { results, critique, improvement } = pipeline;
  const score = (critique?.overallScore ?? 0) + (improvement?.scoreGain ?? 0);

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <ScoreRing score={score} size={72} />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Final score</p>
            <h2 className="text-xl font-bold text-white">
              {results.brand?.name ?? pipeline.brief.projectName}
            </h2>
            <p className="text-sm text-slate-400">{results.brand?.tagline}</p>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2.5 flex-wrap">
          {improvement?.applied?.length ? (
            <Badge variant="accent" dot>
              {improvement.applied.length} improvements applied
            </Badge>
          ) : null}
          <Badge variant="muted">
            {pipeline.completedAgents.length}/10 agents
          </Badge>
          <Button size="sm" variant="outline" onClick={onReset}>
            ← New project
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              const blob = new Blob([JSON.stringify(pipeline, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${results.brand?.name ?? "project"}-mattdesign.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export JSON →
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-[#1E293B]">
        {RESULT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <Card>
        {activeTab === "brand" && <BrandTab brand={results.brand} direction={results.direction} />}
        {activeTab === "structure" && <StructureTab structure={results.structure} />}
        {activeTab === "copy" && <CopyTab copy={results.copy} />}
        {activeTab === "assets" && <AssetsTab assets={results.assets} prompts={results.prompts} />}
        {activeTab === "stack" && <StackTab stack={results.stack} plan={results.executionPlan} />}
        {activeTab === "qa" && <QATab critique={critique} improvement={improvement} />}
      </Card>
    </div>
  );
}

// ─── Tab Components ───────────────────────────────────────────────────────────

function BrandTab({ brand, direction }: { brand?: import("@/types").BrandDNA; direction?: import("@/types").DirectionResult }) {
  if (!brand) return <EmptyTab />;
  return (
    <div className="space-y-6">
      <Section title="Identity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KeyValue label="Name" value={brand.name} />
          <KeyValue label="Tagline" value={brand.tagline} />
          <KeyValue label="Tone" value={brand.tone} />
          <KeyValue label="Mood" value={brand.mood} />
          <KeyValue label="Visual style" value={brand.visualStyle} className="sm:col-span-2" />
        </div>
      </Section>

      <Section title="Colour Palette">
        <div className="flex flex-wrap gap-3">
          {Object.entries(brand.palette).map(([key, color]) => (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <div
                className="h-12 w-12 rounded-xl border border-white/10 shadow-lg cursor-pointer"
                style={{ background: color }}
                title={color}
                onClick={() => navigator.clipboard.writeText(color).catch(() => {})}
              />
              <span className="text-xs text-slate-500">{key}</span>
              <span className="text-xs font-mono text-slate-400">{color}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Personality">
        <div className="flex flex-wrap gap-2">
          {brand.personality.map((trait) => (
            <Badge key={trait} variant="default">{trait}</Badge>
          ))}
        </div>
      </Section>

      <Section title="Brand Rules">
        <ul className="space-y-2">
          {brand.rules.map((rule, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
              {rule}
            </li>
          ))}
        </ul>
      </Section>

      {direction && (
        <Section title="Strategic Direction">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KeyValue label="Objective" value={direction.objective} />
            <KeyValue label="Promise" value={direction.promise} />
            <KeyValue label="Audience" value={direction.audience} />
            <KeyValue label="Creative angle" value={direction.creativeAngle} />
          </div>
          {direction.assumptions.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-2">Assumptions made</p>
              <ul className="space-y-1">
                {direction.assumptions.map((a, i) => (
                  <li key={i} className="text-xs text-slate-500 italic">• {a}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

function StructureTab({ structure }: { structure?: import("@/types").SiteStructure }) {
  if (!structure) return <EmptyTab />;
  return (
    <div className="space-y-6">
      <Section title="Pages">
        {structure.pages.map((page) => (
          <div key={page.slug} className="mb-4 last:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="muted" className="font-mono">{page.slug}</Badge>
              <span className="text-sm text-white">{page.title}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 ml-2">
              {page.sections.map((s) => (
                <Badge key={s} variant="default" className="text-xs">{s}</Badge>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Sections">
        <div className="space-y-2">
          {structure.sections.sort((a, b) => a.order - b.order).map((section) => (
            <div key={section.id} className="flex items-start gap-4 py-2 border-b border-[#1E293B] last:border-0">
              <span className="text-xs font-mono text-slate-600 w-6 flex-shrink-0 mt-0.5">
                {String(section.order).padStart(2, "0")}
              </span>
              <Badge variant="violet" className="flex-shrink-0">{section.type}</Badge>
              <div>
                <span className="text-sm font-medium text-white">{section.id}</span>
                <p className="text-xs text-slate-500 mt-0.5">{section.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Navigation">
        <div className="flex flex-wrap gap-2">
          {structure.navigation.map((item) => (
            <div key={item.href} className="flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#0A0F1E] px-3 py-1.5">
              <span className="text-sm text-slate-300">{item.label}</span>
              <span className="text-xs font-mono text-slate-600">{item.href}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Components">
        <div className="flex flex-wrap gap-2">
          {structure.components.map((comp) => (
            <Badge key={comp} variant="muted">{comp}</Badge>
          ))}
        </div>
      </Section>
    </div>
  );
}

function CopyTab({ copy }: { copy?: import("@/types").SiteCopy }) {
  if (!copy) return <EmptyTab />;
  return (
    <div className="space-y-6">
      <Section title="Meta">
        <div className="grid grid-cols-1 gap-3">
          <KeyValue label="Title" value={copy.meta.title} />
          <KeyValue label="Description" value={copy.meta.description} />
          {copy.meta.ogTitle && <KeyValue label="OG Title" value={copy.meta.ogTitle} />}
        </div>
      </Section>

      <Section title="Hero">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">Headline</p>
            <p className="text-lg font-bold text-white whitespace-pre-line">{copy.hero.headline}</p>
          </div>
          <KeyValue label="Subheadline" value={copy.hero.subheadline} />
          <div className="flex gap-3 flex-wrap">
            <Badge variant="default">{copy.hero.cta.primary}</Badge>
            {copy.hero.cta.secondary && <Badge variant="muted">{copy.hero.cta.secondary}</Badge>}
          </div>
          {copy.hero.proof && (
            <p className="text-xs text-slate-500 italic">{copy.hero.proof}</p>
          )}
        </div>
      </Section>

      {Object.entries(copy.sections).map(([id, section]) => (
        <Section key={id} title={`Section: ${id}`}>
          <div className="space-y-3">
            {section.headline && <KeyValue label="Headline" value={section.headline} />}
            {section.subheadline && <KeyValue label="Subheadline" value={section.subheadline} />}
            {section.body && <KeyValue label="Body" value={section.body} />}
            {section.items && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Items ({section.items.length})</p>
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="rounded-lg bg-[#0A0F1E] px-3 py-2">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.faq && (
              <div>
                <p className="text-xs text-slate-500 mb-2">FAQ ({section.faq.length} items)</p>
                <div className="space-y-2">
                  {section.faq.map((faq, i) => (
                    <div key={i} className="rounded-lg bg-[#0A0F1E] px-3 py-2">
                      <p className="text-sm font-medium text-white">{faq.question}</p>
                      <p className="text-xs text-slate-400 mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      ))}
    </div>
  );
}

function AssetsTab({ assets, prompts }: { assets?: import("@/types").AssetSpec[]; prompts?: import("@/types").ImagePrompt[] }) {
  if (!assets) return <EmptyTab />;
  const priorityColor = { critical: "danger", high: "warning", medium: "default", low: "muted" } as const;

  return (
    <div className="space-y-6">
      <Section title="Asset List">
        <div className="space-y-3">
          {assets.map((asset) => (
            <div key={asset.id} className="flex items-start gap-4 py-3 border-b border-[#1E293B] last:border-0">
              <Badge variant={priorityColor[asset.priority]} className="flex-shrink-0 mt-0.5">
                {asset.priority}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">{asset.name}</span>
                  <Badge variant="muted">{asset.format}</Badge>
                  {asset.dimensions && (
                    <span className="text-xs text-slate-500 font-mono">{asset.dimensions}</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{asset.role}</p>
                {asset.variants && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {asset.variants.map((v) => (
                      <span key={v} className="text-xs text-slate-600 bg-[#0A0F1E] px-1.5 py-0.5 rounded">{v}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {prompts && prompts.length > 0 && (
        <Section title="Image Generation Prompts">
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">{prompt.name}</span>
                  <Badge variant="muted" className="font-mono">{prompt.dimensions}</Badge>
                  {prompt.model && <Badge variant="violet">{prompt.model}</Badge>}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Prompt</p>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {prompt.prompt}
                  </p>
                </div>
                {prompt.negativePrompt && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Negative prompt</p>
                    <p className="text-xs text-red-400/70 font-mono">{prompt.negativePrompt}</p>
                  </div>
                )}
                <button
                  onClick={() => navigator.clipboard.writeText(prompt.prompt).catch(() => {})}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Copy prompt →
                </button>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function StackTab({ stack, plan }: { stack?: import("@/types").TechStack; plan?: import("@/types").ExecutionStep[] }) {
  if (!stack) return <EmptyTab />;
  const costColor = { free: "accent", "open-source": "accent", freemium: "default", paid: "warning" } as const;

  return (
    <div className="space-y-6">
      {Object.entries(stack).map(([category, tools]) => (
        <Section key={category} title={category.charAt(0).toUpperCase() + category.slice(1)}>
          <div className="space-y-2">
            {(tools as import("@/types").StackTool[]).map((tool) => (
              <div key={tool.name} className="flex items-center gap-3 py-2 border-b border-[#1E293B] last:border-0">
                <Badge variant={costColor[tool.cost as keyof typeof costColor] ?? "muted"}>{tool.cost}</Badge>
                <span className="text-sm font-medium text-white flex-1">{tool.name}</span>
                <span className="text-xs text-slate-400 text-right hidden sm:block">{tool.purpose}</span>
              </div>
            ))}
          </div>
        </Section>
      ))}

      {plan && (
        <Section title="Execution Plan">
          <div className="space-y-4">
            {plan.map((step) => (
              <div key={step.phase} className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
                  {step.phase}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-sm font-medium text-white">{step.name}</span>
                    <span className="text-xs text-slate-600">{step.estimatedTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {step.tasks.map((t) => (
                      <span key={t} className="text-xs text-slate-400 bg-[#0A0F1E] px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function QATab({ critique, improvement }: { critique?: import("@/types").CritiqueResult; improvement?: import("@/types").ImprovementResult }) {
  if (!critique) return <EmptyTab />;
  const finalScore = critique.overallScore + (improvement?.scoreGain ?? 0);

  return (
    <div className="space-y-6">
      <Section title="Overall Score">
        <div className="flex items-center gap-6">
          <ScoreRing score={finalScore} size={88} />
          <div className="space-y-1">
            <p className="text-sm text-slate-400">
              Base: <span className="text-white font-medium">{critique.overallScore}</span>
              {improvement?.scoreGain ? (
                <span className="text-emerald-400"> +{improvement.scoreGain} optimizer</span>
              ) : null}
            </p>
            {improvement?.summary && (
              <p className="text-xs text-slate-500 max-w-xs">{improvement.summary}</p>
            )}
          </div>
        </div>
      </Section>

      <Section title="Dimensions">
        <div className="space-y-4">
          {critique.dimensions.map((dim) => (
            <div key={dim.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{dim.name}</span>
                <span className="text-sm font-mono text-slate-400">{dim.score}/100</span>
              </div>
              <Progress value={dim.score} size="sm" />
              {dim.suggestions.length > 0 && (
                <p className="text-xs text-slate-500">↗ {dim.suggestions[0]}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {critique.blockers.length > 0 && (
        <Section title="Blockers">
          <ul className="space-y-1">
            {critique.blockers.map((b, i) => (
              <li key={i} className="text-sm text-red-400 flex items-start gap-2">
                <span className="flex-shrink-0">✗</span> {b}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {critique.warnings.length > 0 && (
        <Section title="Warnings">
          <ul className="space-y-1">
            {critique.warnings.map((w, i) => (
              <li key={i} className="text-sm text-amber-400 flex items-start gap-2">
                <span className="flex-shrink-0">⚠</span> {w}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {critique.passed.length > 0 && (
        <Section title="Passed">
          <ul className="space-y-1">
            {critique.passed.map((p, i) => (
              <li key={i} className="text-sm text-emerald-400 flex items-start gap-2">
                <span className="flex-shrink-0">✓</span> {p}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {improvement?.applied?.length ? (
        <Section title="Optimizer Applied">
          <ul className="space-y-1">
            {improvement.applied.map((a, i) => (
              <li key={i} className="text-sm text-blue-400 flex items-start gap-2">
                <span className="flex-shrink-0">⚡</span> {a}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-[#1E293B]">
        {title}
      </h3>
      {children}
    </div>
  );
}

function KeyValue({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-300 leading-relaxed">{value}</p>
    </div>
  );
}

function EmptyTab() {
  return (
    <div className="flex items-center justify-center py-12 text-slate-500 text-sm">
      No data available for this section.
    </div>
  );
}
