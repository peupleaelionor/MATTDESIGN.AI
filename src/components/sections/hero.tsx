import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import { Check, ArrowRight, Zap } from "lucide-react";

// ─── Hero Section ─────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-36">
      {/* Layered background */}
      <div className="absolute inset-0 md-grid-bg opacity-40" />
      <div className="absolute inset-0 md-noise" />

      {/* Ambient gradient orbs */}
      <div className="absolute -top-48 -left-48 h-[480px] w-[480px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute -top-24 right-[-5%] h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-blue-900/8 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0A0F1E] to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Announcement badge */}
          <Badge variant="default" dot className="mb-8 md-animate-fade-up">
            <Zap className="size-3" />
            MattDESIGN.AI v3 — Self-improving design system
          </Badge>

          {/* Headline */}
          <h1 className="md-heading md-animate-fade-up md-delay-100 max-w-5xl text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem] text-white leading-[1.08]">
            From brief to{" "}
            <span className="md-gradient-text">production-ready&nbsp;site</span>
            <br className="hidden md:block" />
            {" "}in minutes
          </h1>

          {/* Subheadline */}
          <p className="md-animate-fade-up md-delay-200 mt-7 max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed">
            10 specialised AI agents build your brand DNA, copy, assets, and clean code —
            then critique and improve the result automatically.
          </p>

          {/* Proof points */}
          <div className="md-animate-fade-up md-delay-300 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            {PROOF_POINTS.map((point) => (
              <span key={point} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald-400" />
                <span>{point}</span>
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="md-animate-fade-up md-delay-400 mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link href="/generate">
              <Button size="xl" variant="primary" className="md-glow-blue group">
                Generate your site
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="xl" variant="outline">
                See how it works
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <p className="md-animate-fade-up md-delay-500 mt-8 text-sm text-slate-500">
            Trusted by{" "}
            <span className="text-slate-300 font-medium">500+ designers & founders</span>{" "}
            to ship premium projects 10× faster.
          </p>

          {/* Hero visual — terminal/preview mockup */}
          <div className="md-animate-fade-up md-delay-600 mt-16 w-full max-w-4xl">
            {/* Gradient border wrapper */}
            <div className="rounded-2xl p-px bg-gradient-to-b from-blue-500/30 via-violet-500/20 to-transparent">
              <div className="rounded-[15px] bg-[#111827] overflow-hidden shadow-2xl">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1E293B] bg-[#0A0F1E]/80">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
                  <span className="ml-4 text-xs text-slate-500 font-mono tracking-wide">
                    mattdesign-ai — pipeline complete
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400/80 font-mono">live</span>
                  </span>
                </div>
                {/* Pipeline visualization */}
                <div className="p-5 md:p-6 font-mono text-[13px] space-y-1">
                  {PIPELINE_PREVIEW.map((line, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="flex items-center justify-center h-5 w-5 rounded-md bg-emerald-400/10">
                        <Check className="size-3 text-emerald-400" />
                      </span>
                      <span className="text-slate-200 font-medium min-w-[110px]">{line.agent}</span>
                      <span className="text-slate-600 hidden sm:inline">·</span>
                      <span className="text-slate-500 hidden sm:inline">{line.status}</span>
                      {line.score && (
                        <span className="ml-auto px-2 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400 text-xs font-bold tabular-nums">
                          {line.score}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PROOF_POINTS = [
  "Free & open-source",
  "No API key required",
  "Production-ready output",
  "Self-improving pipeline",
];

const PIPELINE_PREVIEW = [
  { agent: "Director", status: "Brief analysed — SaaS / professional tone", score: null },
  { agent: "Strategist", status: "Angle defined — authority + proof structure", score: null },
  { agent: "Brand Designer", status: "Brand DNA created — navy + blue + violet", score: null },
  { agent: "UI Designer", status: "Site structure designed — 7 sections", score: null },
  { agent: "Copywriter", status: "All copy written — hero, features, FAQ, footer", score: null },
  { agent: "QA Reviewer", status: "Quality checked — 0 blockers", score: "82" },
  { agent: "Critic", status: "Output critiqued — 3 improvements identified", score: null },
  { agent: "Optimizer", status: "Improvements applied — score improved", score: "91" },
];
