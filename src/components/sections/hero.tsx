import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import { Check, ArrowRight, Zap } from "lucide-react";

// ─── Hero Section ─────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background grid */}
      <div className="absolute inset-0 md-grid-bg opacity-50" />

      {/* Gradient orbs */}
      <div className="absolute -top-60 -left-60 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute -top-20 right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-96 w-[800px] rounded-full bg-blue-900/10 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Announcement badge */}
          <div className="md-animate-fade-up mb-8">
            <Badge variant="default" dot>
              <Zap className="size-3" />
              MattDESIGN.AI v3 — Self-improving pipeline
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="md-heading md-animate-fade-up md-delay-100 max-w-4xl text-5xl md:text-6xl lg:text-[4.5rem] text-white tracking-tight">
            Design. Code. Ship.{" "}
            <br className="hidden sm:block" />
            <span className="md-gradient-text">Automatically.</span>
          </h1>

          {/* Subheadline */}
          <p className="md-animate-fade-up md-delay-200 mt-6 max-w-xl text-lg md:text-xl text-slate-400 leading-relaxed">
            From a one-line brief to a production-ready website — brand DNA,
            copy, assets, and clean code — in minutes.
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
          <div className="md-animate-fade-up md-delay-300 mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Link href="/generate">
              <Button size="xl" variant="primary" className="md-glow-blue group">
                Generate your site
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="xl" variant="outline">
                How it works
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <p className="md-animate-fade-up md-delay-400 mt-6 text-sm text-slate-500">
            10 AI agents ·{" "}
            <span className="text-slate-400">Production-ready output</span>
            {" "}· Zero compromise
          </p>

          {/* Hero visual — animated pipeline terminal */}
          <div className="md-animate-fade-up md-delay-500 mt-16 w-full max-w-3xl">
            <div className="rounded-2xl border border-[#1E293B] bg-[#0D1117] overflow-hidden shadow-2xl [box-shadow:0_0_40px_rgba(59,130,246,0.12),0_24px_64px_rgba(0,0,0,0.6)]">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E293B] bg-[#0A0F1E]">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/70" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-xs text-slate-600 font-mono">
                  mattdesign.ai — pipeline
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-500/70 font-mono">live</span>
                </div>
              </div>

              {/* Pipeline lines — staggered reveal via CSS animations */}
              <div className="p-5 font-mono text-sm space-y-2.5 bg-[#0D1117]">
                {PIPELINE_PREVIEW.map((line, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 opacity-0"
                    style={{
                      animation: `md-fade-up 0.4s ease ${200 + i * 120}ms both`,
                    }}
                  >
                    <span className={line.done ? "text-emerald-400" : "text-blue-400 animate-pulse"}>
                      {line.done ? "✓" : "›"}
                    </span>
                    <span className="text-slate-300 min-w-[120px]">{line.agent}</span>
                    <span className="text-slate-600 hidden sm:block">—</span>
                    <span className="text-slate-500 text-xs hidden sm:block flex-1 truncate">{line.status}</span>
                    {line.score && (
                      <span className="ml-auto text-emerald-400 text-xs font-medium tabular-nums">
                        {line.score}
                      </span>
                    )}
                  </div>
                ))}

                {/* Cursor line */}
                <div
                  className="flex items-center gap-3 opacity-0"
                  style={{ animation: `md-fade-up 0.4s ease ${200 + PIPELINE_PREVIEW.length * 120}ms both` }}
                >
                  <span className="text-blue-400">›</span>
                  <span className="text-slate-600 text-xs">
                    Output ready — 91/100 ·{" "}
                    <span className="text-emerald-400">export available</span>
                    <span className="inline-block w-2 h-3.5 bg-blue-400 ml-1 align-middle animate-pulse" />
                  </span>
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
  { agent: "Director",    status: "SaaS / professional — authority-first angle",    score: null,     done: true  },
  { agent: "Strategist",  status: "5-stage conversion funnel defined",              score: null,     done: true  },
  { agent: "Brand",       status: "Identity: navy + blue + violet, Inter + Mono",   score: null,     done: true  },
  { agent: "UI/UX",       status: "7 sections — hero → features → proof → CTA",     score: null,     done: true  },
  { agent: "Assets",      status: "8 assets · 3 SD/XL prompts generated",          score: null,     done: true  },
  { agent: "Copywriter",  status: "All copy written — hero, features, FAQ, footer", score: null,     done: true  },
  { agent: "Builder",     status: "Stack: Next.js + Tailwind + Supabase + Vercel",  score: null,     done: true  },
  { agent: "QA",          status: "0 blockers · 2 warnings",                        score: "82/100", done: true  },
  { agent: "Critic",      status: "3 improvements identified",                      score: "77/100", done: true  },
  { agent: "Optimizer",   status: "CTAs sharpened · urgency added · +9 score",      score: "91/100", done: false },
];
