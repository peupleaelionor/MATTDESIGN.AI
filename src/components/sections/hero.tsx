import Link from "next/link";
import { Button, Badge } from "@/components/ui";

// ─── Hero Section ─────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background grid */}
      <div className="absolute inset-0 md-grid-bg opacity-60" />

      {/* Gradient orbs */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[160px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Announcement badge */}
          <Badge variant="default" dot className="mb-8 md-animate-fade-up">
            MattDESIGN.AI v3 — Self-improving system
          </Badge>

          {/* Headline */}
          <h1 className="md-heading md-animate-fade-up md-delay-100 max-w-4xl text-5xl md:text-6xl lg:text-7xl text-white">
            Design. Code. Ship.{" "}
            <span className="md-gradient-text">Automatically.</span>
          </h1>

          {/* Subheadline */}
          <p className="md-animate-fade-up md-delay-200 mt-6 max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed">
            From a one-line brief to a production-ready website — brand DNA, copy, assets,
            and clean code — in minutes. 10 AI agents. Zero compromise on quality.
          </p>

          {/* CTAs */}
          <div className="md-animate-fade-up md-delay-300 mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link href="/generate">
              <Button size="xl" variant="primary" className="md-glow-blue">
                Generate your site →
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="xl" variant="outline">
                See how it works
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <p className="md-animate-fade-up md-delay-400 mt-8 text-sm text-slate-500">
            Used by <span className="text-slate-300 font-medium">500+ designers & founders</span> to ship premium projects 10× faster.
          </p>

          {/* Hero visual — terminal/preview mockup */}
          <div className="md-animate-fade-up md-delay-500 mt-16 w-full max-w-4xl rounded-2xl border border-[#1E293B] bg-[#111827] overflow-hidden shadow-2xl md-glow-blue">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E293B] bg-[#0A0F1E]">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-4 text-xs text-slate-500 font-mono">MattDESIGN.AI — pipeline running</span>
            </div>
            {/* Pipeline visualization */}
            <div className="p-6 font-mono text-sm space-y-2">
              {PIPELINE_PREVIEW.map((line, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-emerald-400">{line.icon}</span>
                  <span className="text-slate-300">{line.agent}</span>
                  <span className="text-slate-600">—</span>
                  <span className="text-slate-400">{line.status}</span>
                  {line.score && (
                    <span className="ml-auto text-emerald-400 text-xs">{line.score}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PIPELINE_PREVIEW = [
  { icon: "✓", agent: "Director", status: "Brief analysed — SaaS / professional tone", score: null },
  { icon: "✓", agent: "Strategist", status: "Angle defined — authority + proof structure", score: null },
  { icon: "✓", agent: "Brand Designer", status: "Brand DNA created — navy + blue + violet", score: null },
  { icon: "✓", agent: "UI Designer", status: "Site structure designed — 7 sections", score: null },
  { icon: "✓", agent: "Copywriter", status: "All copy written — hero, features, FAQ, footer", score: null },
  { icon: "✓", agent: "QA Reviewer", status: "Quality checked — 0 blockers", score: "82/100" },
  { icon: "✓", agent: "Critic", status: "Output critiqued — 3 improvements identified", score: null },
  { icon: "✓", agent: "Optimizer", status: "Improvements applied — score improved", score: "91/100" },
];
