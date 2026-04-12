import Link from "next/link";
import { Badge } from "@/components/ui";
import { AgentIcon } from "@/components/agent-icon";
import { AGENT_CONFIGS } from "@/config/agent-config";

// ─── Docs Page ────────────────────────────────────────────────────────────────

export const metadata = {
  title: "MattDESIGN.AI — Documentation",
  description:
    "Complete documentation for MattDESIGN.AI v3 — the self-improving AI design system. Learn how to use the pipeline, configure agents, and integrate with Claude.",
};

export default function DocsPage() {
  return (
    <main className="min-h-screen pt-24 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <nav className="sticky top-28 space-y-1">
              {NAV_SECTIONS.map((section) => (
                <div key={section.label} className="pb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 px-3">
                    {section.label}
                  </p>
                  {section.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-20">

            {/* Page header */}
            <div>
              <Badge variant="muted" className="mb-4">Documentation</Badge>
              <h1 className="md-heading text-4xl md:text-5xl text-white mb-4">
                MattDESIGN.AI{" "}
                <span className="md-gradient-text">v3</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                A self-improving multi-agent system that transforms a one-line brief into
                a complete, production-ready web project — brand DNA, copy, assets, and code.
              </p>
            </div>

            {/* Quick Start */}
            <Section id="quickstart" title="Quick Start">
              <p className="text-slate-400 mb-6">
                MattDESIGN.AI works out of the box in <strong className="text-white">Demo Mode</strong> — no
                API key required. The 10-agent pipeline runs with high-quality mock data so you can explore
                the full output structure.
              </p>
              <p className="text-slate-400 mb-6">
                To unlock <strong className="text-slate-300">real AI generation</strong> (Claude Sonnet),
                add your Anthropic API key:
              </p>

              <CodeBlock
                label=".env.local"
                code={`ANTHROPIC_API_KEY=sk-ant-api03-...`}
              />

              <p className="text-slate-400 mt-4 mb-6">
                Then navigate to{" "}
                <Link href="/generate" className="text-blue-400 hover:underline">/generate</Link>
                , fill in your brief, and click <strong className="text-white">Generate →</strong>
              </p>

              <Steps items={[
                { label: "Fill in the brief", detail: "Project name + description are the only required fields. Sector, audience, tone, and style are optional but improve output quality." },
                { label: "Watch the pipeline run", detail: "10 agents execute in sequence. The progress stream updates in real time. Each agent completes before the next starts." },
                { label: "Review the output", detail: "6 tabs: Brand DNA, Site Structure, Copy, Assets, Tech Stack, QA Report. Each is downloadable as JSON." },
              ]} />
            </Section>

            {/* Pipeline Architecture */}
            <Section id="architecture" title="Pipeline Architecture">
              <p className="text-slate-400 mb-6">
                The pipeline is a sequential chain of 10 specialised agents. Each agent receives the
                outputs of all previous agents as context.
              </p>

              <div className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-5 mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-medium">Execution order</p>
                <div className="space-y-2">
                  {PIPELINE_PHASES.map((phase) => (
                    <div key={phase.label} className="flex items-start gap-3">
                      <span className="text-xs font-mono text-slate-600 w-6 flex-shrink-0 mt-0.5">
                        {String(phase.order).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-white">{phase.label}</span>
                          <Badge variant="muted">{phase.id}</Badge>
                        </div>
                        <p className="text-xs text-slate-500">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-slate-400">
                The pipeline ends with a <strong className="text-white">self-improvement loop</strong>:
                the Critic scores the output across 6 dimensions, then the Optimizer applies targeted fixes.
                The final score is the QA score + optimizer gain.
              </p>
            </Section>

            {/* Agents */}
            <Section id="agents" title="The 10 Agents">
              <p className="text-slate-400 mb-8">
                Each agent has a scoped system prompt, typed input, and typed output. When{" "}
                <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-sm">ANTHROPIC_API_KEY</code>
                {" "}is set, agents call Claude. Otherwise, they fall back to high-quality mock data.
              </p>

              <div className="space-y-4">
                {AGENT_CONFIGS.map((agent) => {
                  const agentDoc = AGENT_DOCS[agent.id];
                  return (
                    <div
                      key={agent.id}
                      className="rounded-xl border border-[#1E293B] bg-[#111827] p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                          style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}25` }}
                        >
                          <AgentIcon name={agent.icon} className="h-4 w-4" style={{ color: agent.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-semibold text-white">{agent.name}</span>
                            <Badge variant="muted">{agent.role}</Badge>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">{agent.description}</p>
                          {agentDoc && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-slate-600 mb-1">Input</p>
                                <p className="text-slate-400 font-mono">{agentDoc.input}</p>
                              </div>
                              <div>
                                <p className="text-slate-600 mb-1">Output</p>
                                <p className="text-slate-400 font-mono">{agentDoc.output}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Configuration */}
            <Section id="configuration" title="Configuration">
              <p className="text-slate-400 mb-6">
                MattDESIGN.AI is designed to work at zero cost in demo mode and upgrade gracefully
                when you add an API key.
              </p>

              <div className="space-y-5">
                <ConfigItem
                  label="ANTHROPIC_API_KEY"
                  type="string"
                  required={false}
                  description="Your Anthropic API key. Enables real Claude Sonnet generation for all 10 agents. Without this, the system runs in demo mode with pre-built mock data."
                />
              </div>

              <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                <p className="text-sm font-medium text-amber-400 mb-2">Demo Mode</p>
                <p className="text-sm text-slate-400">
                  In demo mode, every agent returns high-quality mock data that demonstrates the
                  full output structure. The pipeline runs in ~2 seconds. This is the default behaviour
                  — no API key, no cost.
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-sm font-medium text-emerald-400 mb-2">AI Mode</p>
                <p className="text-sm text-slate-400">
                  With <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">ANTHROPIC_API_KEY</code> set,
                  each agent calls <strong className="text-white">claude-sonnet-4-6</strong> with a
                  senior-grade system prompt. If Claude returns valid JSON, it&apos;s used. If parsing
                  fails, the agent falls back to mock data silently.
                </p>
              </div>
            </Section>

            {/* API Reference */}
            <Section id="api" title="API Reference">

              <ApiEndpoint
                method="POST"
                path="/api/generate"
                description="Run the full 10-agent pipeline for a project brief. Returns a Server-Sent Events stream of PipelineState updates."
                request={{
                  required: ["projectName", "description"],
                  optional: ["sector", "audience", "style", "tone", "lang"],
                  example: `{
  "projectName": "Acme Studio",
  "description": "A SaaS platform for design teams",
  "sector": "SaaS",
  "audience": "B2B design teams",
  "tone": "professional"
}`,
                }}
                response={`data: {"id":"pipeline-xxx","status":"running","currentAgent":"director","completedAgents":[],...}
data: {"id":"pipeline-xxx","status":"running","currentAgent":"strategist","completedAgents":["director"],...}
...
data: {"id":"pipeline-xxx","status":"complete","completedAgents":["director",...,"optimizer"],...}`}
              />

              <ApiEndpoint
                method="GET"
                path="/api/status"
                description="Returns the current platform status including whether Claude is configured."
                response={`{
  "version": "3.0.0",
  "pipeline": {
    "mode": "ai",
    "claudeConfigured": true,
    "model": "claude-sonnet-4-6"
  },
  "agents": 10,
  "streaming": true
}`}
              />

            </Section>

            {/* Stack */}
            <Section id="stack" title="Default Stack">
              <p className="text-slate-400 mb-6">
                MattDESIGN.AI recommends free and open-source tools by default.
                Every recommendation in the Builder agent output follows this priority order:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {STACK_ITEMS.map((item) => (
                  <div key={item.name} className="flex items-start gap-3 rounded-xl border border-[#1E293B] bg-[#111827] p-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.purpose}</p>
                      <Badge variant="accent" className="mt-1.5">{item.cost}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* FAQ */}
            <Section id="faq" title="FAQ">
              <div className="space-y-5">
                {FAQ_ITEMS.map((item) => (
                  <div key={item.q} className="border-b border-[#1E293B] pb-5 last:border-0">
                    <p className="text-sm font-semibold text-white mb-2">{item.q}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </Section>

          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-4 border-b border-[#1E293B]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="rounded-xl border border-[#1E293B] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0A0F1E] border-b border-[#1E293B]">
        <span className="text-xs font-mono text-slate-500">{label}</span>
      </div>
      <pre className="p-4 text-sm font-mono text-slate-300 bg-[#0D1117] overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Steps({ items }: { items: { label: string; detail: string }[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white mt-0.5">
            {i + 1}
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
            <p className="text-sm text-slate-400 leading-relaxed">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfigItem({ label, type, required, description }: {
  label: string; type: string; required: boolean; description: string;
}) {
  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#111827] p-5">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <code className="text-sm font-mono text-blue-400">{label}</code>
        <Badge variant="muted">{type}</Badge>
        {required
          ? <Badge variant="danger">required</Badge>
          : <Badge variant="muted">optional</Badge>}
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ApiEndpoint({ method, path, description, request, response }: {
  method: string;
  path: string;
  description: string;
  request?: { required: string[]; optional: string[]; example: string };
  response: string;
}) {
  const methodColor = method === "POST" ? "text-violet-400 bg-violet-500/10" : "text-emerald-400 bg-emerald-500/10";
  return (
    <div className="rounded-xl border border-[#1E293B] overflow-hidden mb-8">
      <div className="flex items-center gap-3 px-5 py-4 bg-[#111827] border-b border-[#1E293B]">
        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${methodColor}`}>{method}</span>
        <code className="text-sm font-mono text-white">{path}</code>
      </div>
      <div className="p-5 space-y-5">
        <p className="text-sm text-slate-400">{description}</p>

        {request && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">Request body</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {request.required.map((f) => (
                <code key={f} className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded">
                  {f} *
                </code>
              ))}
              {request.optional.map((f) => (
                <code key={f} className="text-xs bg-[#1E293B] text-slate-400 px-2 py-0.5 rounded">
                  {f}
                </code>
              ))}
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 bg-[#0D1117] rounded-lg overflow-x-auto">
              {request.example}
            </pre>
          </div>
        )}

        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">Response</p>
          <pre className="p-4 text-xs font-mono text-slate-300 bg-[#0D1117] rounded-lg overflow-x-auto">
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: "Get started",
    links: [
      { label: "Quick start", href: "#quickstart" },
      { label: "Configuration", href: "#configuration" },
    ],
  },
  {
    label: "Architecture",
    links: [
      { label: "Pipeline", href: "#architecture" },
      { label: "The 10 agents", href: "#agents" },
    ],
  },
  {
    label: "Reference",
    links: [
      { label: "API endpoints", href: "#api" },
      { label: "Default stack", href: "#stack" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

const PIPELINE_PHASES = AGENT_CONFIGS.map((a, i) => ({
  order: i + 1,
  id: a.id,
  label: a.name,
  description: a.description,
}));

const AGENT_DOCS: Record<string, { input: string; output: string }> = {
  director:         { input: "ProjectBrief",                                  output: "DirectionResult" },
  strategist:       { input: "ProjectBrief + DirectionResult",                output: "Strategy" },
  "brand-designer": { input: "ProjectBrief + DirectionResult",                output: "BrandDNA" },
  "ui-designer":    { input: "ProjectBrief + BrandDNA + Strategy",            output: "SiteStructure" },
  "asset-generator":{ input: "ProjectBrief + BrandDNA",                       output: "AssetSpec[] + ImagePrompt[]" },
  copywriter:       { input: "ProjectBrief + BrandDNA + Strategy",            output: "SiteCopy" },
  builder:          { input: "ProjectBrief",                                  output: "TechStack + ExecutionStep[]" },
  "qa-reviewer":    { input: "PipelineResults (partial)",                     output: "CritiqueResult" },
  critic:           { input: "PipelineResults + QA score",                    output: "CritiqueResult" },
  optimizer:        { input: "PipelineResults + CritiqueResult",              output: "ImprovementResult" },
};

const STACK_ITEMS = [
  { name: "Next.js 16", purpose: "React framework with App Router", cost: "open-source" },
  { name: "TypeScript", purpose: "End-to-end type safety", cost: "open-source" },
  { name: "Tailwind CSS v4", purpose: "Utility-first styling", cost: "open-source" },
  { name: "Claude Sonnet 4.6", purpose: "LLM for all 10 agents", cost: "pay-per-use" },
  { name: "Supabase", purpose: "Database + auth + storage", cost: "freemium" },
  { name: "Vercel", purpose: "Deployment + edge network", cost: "freemium" },
  { name: "Stable Diffusion XL", purpose: "Image generation", cost: "open-source" },
  { name: "Penpot", purpose: "UI/UX design & prototyping", cost: "open-source" },
];

const FAQ_ITEMS = [
  {
    q: "Does it work without an API key?",
    a: "Yes. In demo mode, every agent returns pre-built, high-quality mock data that mirrors the full output structure. It's a complete representation of what AI mode would produce.",
  },
  {
    q: "What does the output actually include?",
    a: "Brand DNA (palette, typography, rules), strategic direction, site structure, complete copywriting for all sections, image generation prompts, tech stack recommendations, and a scored QA report.",
  },
  {
    q: "Can I export the result?",
    a: "Yes. Click 'Export JSON →' on the results page to download the full pipeline output as a JSON file. This can be imported into downstream tools or processed programmatically.",
  },
  {
    q: "How much does a generation cost in AI mode?",
    a: "10 Claude Sonnet API calls per generation, roughly 4,000–6,000 input/output tokens each. At Anthropic's pricing (~$3/$15 per M tokens), a full generation costs approximately $0.20–0.50.",
  },
  {
    q: "Can I use my own Claude model or another provider?",
    a: "Yes. Update the MODEL constant in src/lib/claude.ts to any Anthropic model. For other providers (OpenAI, Ollama), replace the callClaude() implementation — the interface is provider-agnostic.",
  },
  {
    q: "Is the code open-source?",
    a: "Yes. MIT licensed. You can fork, deploy, and modify freely.",
  },
];
