import Link from "next/link";
import { Button, Badge, Card } from "@/components/ui";

// ─── CTA Section ─────────────────────────────────────────────────────────────

export function CTASection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card
          glow="blue"
          glass
          className="relative overflow-hidden text-center px-8 py-16 md:py-24"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-violet-600/10 pointer-events-none" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-blue-600/20 blur-[80px] pointer-events-none" />

          <div className="relative flex flex-col items-center gap-6">
            <Badge variant="default" dot>Early access open</Badge>

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
                <Button size="xl" variant="primary" className="md-glow-blue">
                  Generate your site →
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="xl" variant="outline">
                  Read the docs
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-2">
              Free · Open-source · No credit card required
            </p>
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
    <section className="py-16 border-y border-[#1E293B] bg-[#111827]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center text-center gap-2">
              <span className="text-4xl md:text-5xl font-black md-gradient-text">
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
