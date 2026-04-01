import { Badge } from "@/components/ui";

// ─── How It Works Section ─────────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Drop your brief",
    description: "Name, description, sector, tone, audience. Even a single sentence is enough to get started. Our Director agent fills in the gaps intelligently.",
    detail: "No lengthy forms. No configuration. Just your idea.",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "02",
    title: "Agents get to work",
    description: "10 specialised agents run in sequence: strategic direction, brand identity, site architecture, copy, assets, code recommendations, QA, critique, and optimisation.",
    detail: "Each agent does one thing — perfectly.",
    color: "from-violet-500 to-violet-600",
  },
  {
    number: "03",
    title: "Download your project",
    description: "Receive a fully structured project: design system, complete copy, asset prompts, component architecture, recommended stack and an execution plan.",
    detail: "Production-ready. Nothing generic.",
    color: "from-emerald-400 to-blue-500",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#111827]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="muted" className="mb-4">How it works</Badge>
          <h2 className="md-heading text-3xl md:text-4xl lg:text-5xl text-white">
            Brief in.{" "}
            <span className="md-gradient-text">Premium site out.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Three steps. Zero compromise.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-emerald-400/30" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-start lg:items-center lg:text-center">
                {/* Step number */}
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white font-black text-xl shadow-lg mb-6`}>
                  {step.number}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  {step.description}
                </p>
                <p className="text-xs text-slate-500 italic">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline diagram */}
        <div className="mt-16 rounded-2xl border border-[#1E293B] bg-[#0A0F1E] p-6 md:p-8">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-6">
            Pipeline flow
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {PIPELINE_FLOW.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#111827] px-3 py-2">
                  <span className="text-sm">{step.icon}</span>
                  <span className="text-xs font-medium text-slate-300">{step.label}</span>
                </div>
                {i < PIPELINE_FLOW.length - 1 && (
                  <span className="text-slate-600 text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const PIPELINE_FLOW = [
  { icon: "🎬", label: "Director" },
  { icon: "🧭", label: "Strategist" },
  { icon: "🎨", label: "Brand" },
  { icon: "🖥️", label: "UI/UX" },
  { icon: "🖼️", label: "Assets" },
  { icon: "✍️", label: "Copy" },
  { icon: "🔧", label: "Builder" },
  { icon: "✅", label: "QA" },
  { icon: "🔍", label: "Critic" },
  { icon: "⚡", label: "Optimizer" },
];
