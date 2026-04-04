import Link from "next/link";
import { Button, Badge, Card } from "@/components/ui";
import { ArrowRight, Sparkles, Zap, Shield, Globe } from "lucide-react";

// ─── CTA Section ─────────────────────────────────────────────────────────────

export function CTASection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card
          glass
          className="relative overflow-hidden text-center px-8 py-16 md:py-24"
        >
          {/* Layered background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-violet-600/8 pointer-events-none" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-blue-600/15 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

          {/* Gradient border top */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          <div className="relative flex flex-col items-center gap-6">
            <Badge variant="default" dot>
              <Sparkles className="size-3" />
              Early access open
            </Badge>

            <h2 className="md-heading text-3xl md:text-4xl lg:text-5xl text-white max-w-3xl">
              Your next premium project{" "}
              <span className="md-gradient-text">starts here.</span>
            </h2>

            <p className="text-lg text-slate-400 max-w-xl">
              One brief. Full team. Zero compromise.
              Generate a production-ready site in minutes — free, open-source, yours to own.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <Link href="/generate">
                <Button size="xl" variant="primary" className="md-glow-blue group">
                  Generate your site
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="xl" variant="outline">
                  Read the docs
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="size-3.5 text-emerald-400" />
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="size-3.5 text-blue-400" />
                Open-source
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-violet-400" />
                No credit card
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ─── Social Proof / Metrics Section ──────────────────────────────────────────

const METRICS = [
  { value: "10×", label: "Faster than a design team" },
  { value: "10", label: "Specialised agents" },
  { value: "100%", label: "Free & open-source stack" },
  { value: "∞", label: "Projects you can generate" },
];

export function MetricsSection() {
  return (
    <section className="relative py-16">
      {/* Gradient borders */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />

      <div className="absolute inset-0 bg-[#111827]/30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center text-center gap-2">
              <span className="text-4xl md:text-5xl font-black md-gradient-text tabular-nums">
                {metric.value}
              </span>
              <span className="text-sm text-slate-400">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
