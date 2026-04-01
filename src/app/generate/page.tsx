"use client";

import { useState } from "react";
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

export default function GeneratePage() {
  const [step, setStep] = useState<Step>("brief");
  const [brief, setBrief] = useState<Partial<ProjectBrief>>({
    tone: "professional",
    lang: "en",
  });
  const [pipeline, setPipeline] = useState<PipelineState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("brand");

  // ── Validation ────────────────────────────────────────────────────────────

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!brief.projectName?.trim()) next.projectName = "Project name is required";
    if (!brief.description?.trim()) next.description = "Description is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!validate()) return;
    setStep("generating");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });

      if (!res.ok) throw new Error("Generation failed");
      const state = (await res.json()) as PipelineState;
      setPipeline(state);
      setStep("results");
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
      setStep("brief");
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex flex-col items-center text-center mb-12">
          <Badge variant="accent" dot className="mb-4">Generator</Badge>
          <h1 className="md-heading text-3xl md:text-4xl text-white">
            Generate your{" "}
            <span className="md-gradient-text">premium project</span>
          </h1>
          <p className="mt-3 text-slate-400 max-w-lg">
            Fill in the brief. The pipeline does the rest.
          </p>
        </div>

        {/* Steps */}
        {step === "brief" && (
          <BriefForm
            brief={brief}
            errors={errors}
            onChange={(patch) => setBrief((prev) => ({ ...prev, ...patch }))}
            onSubmit={handleGenerate}
          />
        )}

        {step === "generating" && (
          <GeneratingView brief={brief} />
        )}

        {step === "results" && pipeline && (
          <ResultsView
            pipeline={pipeline}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onReset={() => {
              setStep("brief");
              setPipeline(null);
            }}
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
          <span className="text-2xl">📋</span>
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
              label="Style"
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

// ─── Generating View ──────────────────────────────────────────────────────────

function GeneratingView({ brief }: { brief: Partial<ProjectBrief> }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="text-center py-10">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Generating <span className="text-blue-400">{brief.projectName}</span>
            </h2>
            <p className="text-sm text-slate-400">10 agents are working on your project…</p>
          </div>
          <Progress value={45} showValue label="Pipeline progress" className="w-full max-w-xs" />
        </div>
      </Card>

      {/* Agent status list */}
      <div className="space-y-2">
        {AGENT_CONFIGS.map((agent, i) => (
          <div
            key={agent.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 transition-all",
              i === 4
                ? "border-blue-500/50 bg-blue-500/10"
                : i < 4
                ? "border-[#1E293B] bg-[#111827] opacity-60"
                : "border-[#1E293B]/50 bg-transparent opacity-30",
            )}
          >
            <span className="text-lg">{agent.icon}</span>
            <span className="text-sm font-medium text-slate-300 flex-1">{agent.name}</span>
            <span className={cn(
              "text-xs",
              i === 4 ? "text-blue-400 animate-pulse" : i < 4 ? "text-emerald-400" : "text-slate-600",
            )}>
              {i === 4 ? "Running…" : i < 4 ? "Done ✓" : "Waiting"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Results View ─────────────────────────────────────────────────────────────

const RESULT_TABS = [
  { id: "brand", label: "🎨 Brand DNA" },
  { id: "structure", label: "🖥️ Structure" },
  { id: "copy", label: "✍️ Copy" },
  { id: "assets", label: "🖼️ Assets" },
  { id: "stack", label: "🔧 Stack" },
  { id: "qa", label: "✅ QA Report" },
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
    <div className="space-y-6">
      {/* Summary bar */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <ScoreRing score={score} size={72} />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Final score</p>
            <h2 className="text-xl font-bold text-white">
              {results.brand?.name ?? pipeline.brief.projectName}
            </h2>
            <p className="text-sm text-slate-400">{results.brand?.tagline}</p>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3 flex-wrap">
          {improvement?.applied?.length && (
            <Badge variant="accent" dot>{improvement.applied.length} improvements applied</Badge>
          )}
          <Badge variant="muted">
            {pipeline.completedAgents.length}/10 agents
          </Badge>
          <Button size="sm" variant="outline" onClick={onReset}>
            ← New project
          </Button>
          <Button size="sm" variant="primary">
            Export →
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {RESULT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5",
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
            <div key={key} className="flex flex-col items-center gap-2">
              <div
                className="h-12 w-12 rounded-xl border border-white/10 shadow-lg"
                style={{ background: color }}
                title={color}
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
        <div className="space-y-3">
          {structure.sections.sort((a, b) => a.order - b.order).map((section) => (
            <div key={section.id} className="flex items-start gap-4 py-2 border-b border-[#1E293B] last:border-0">
              <span className="text-xs font-mono text-slate-600 w-6 flex-shrink-0">
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
        </div>
      </Section>

      <Section title="Hero">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">Headline</p>
            <p className="text-lg font-bold text-white whitespace-pre-line">{copy.hero.headline}</p>
          </div>
          <KeyValue label="Subheadline" value={copy.hero.subheadline} />
          <div className="flex gap-3">
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
            <KeyValue label="Headline" value={section.headline} />
            {section.subheadline && <KeyValue label="Subheadline" value={section.subheadline} />}
            {section.body && <KeyValue label="Body" value={section.body} />}
            {section.items && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Items</p>
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
                <p className="text-xs text-slate-500 mb-2">FAQ</p>
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
                  <div className="flex gap-1 mt-1.5">
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
                  <p className="text-sm text-slate-300 leading-relaxed font-mono text-xs">
                    {prompt.prompt}
                  </p>
                </div>
                {prompt.negativePrompt && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Negative prompt</p>
                    <p className="text-xs text-red-400/70 font-mono">{prompt.negativePrompt}</p>
                  </div>
                )}
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
                <Badge variant={costColor[tool.cost]}>{tool.cost}</Badge>
                <span className="text-sm font-medium text-white flex-1">{tool.name}</span>
                <span className="text-xs text-slate-400">{tool.purpose}</span>
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
                  <div className="flex items-center gap-2 mb-1">
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

  return (
    <div className="space-y-6">
      <Section title="Overall Score">
        <div className="flex items-center gap-6">
          <ScoreRing
            score={critique.overallScore + (improvement?.scoreGain ?? 0)}
            size={88}
          />
          <div className="space-y-1">
            <p className="text-sm text-slate-400">
              Base: <span className="text-white">{critique.overallScore}</span>
              {improvement?.scoreGain ? ` + ${improvement.scoreGain} (optimizer)` : ""}
            </p>
            {improvement?.summary && (
              <p className="text-xs text-slate-500">{improvement.summary}</p>
            )}
          </div>
        </div>
      </Section>

      <Section title="Dimensions">
        <div className="space-y-3">
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

      <Section title="Warnings">
        <ul className="space-y-1">
          {critique.warnings.map((w, i) => (
            <li key={i} className="text-sm text-amber-400 flex items-start gap-2">
              <span className="flex-shrink-0">⚠</span> {w}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Passed">
        <ul className="space-y-1">
          {critique.passed.map((p, i) => (
            <li key={i} className="text-sm text-emerald-400 flex items-start gap-2">
              <span className="flex-shrink-0">✓</span> {p}
            </li>
          ))}
        </ul>
      </Section>

      {improvement && improvement.applied.length > 0 && (
        <Section title="Optimizer Applied">
          <ul className="space-y-1">
            {improvement.applied.map((a, i) => (
              <li key={i} className="text-sm text-blue-400 flex items-start gap-2">
                <span className="flex-shrink-0">⚡</span> {a}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{title}</h3>
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
