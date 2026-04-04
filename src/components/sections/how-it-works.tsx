import {
  Megaphone,
  Compass,
  Palette,
  Monitor,
  Images,
  PenLine,
  Wrench,
  ClipboardCheck,
  SearchCode,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { FileText, Cpu, Download, ArrowRight } from "lucide-react";
import type { FC } from "react";
import type { LucideProps } from "lucide-react";
import { AgentIcon } from "@/components/agent-icon";
import { AGENT_CONFIGS } from "@/config/agent-config";

// ─── How It Works Section ─────────────────────────────────────────────────────

const STEPS: {
  number: string;
  title: string;
  description: string;
  detail: string;
  Icon: FC<LucideProps>;
  gradientFrom: string;
  gradientTo: string;
}[] = [
  {
    number: "01",
    title: "Drop your brief",
    description: "Name, description, sector, tone, audience. Even a single sentence is enough to get started. Our Director agent fills in the gaps intelligently.",
    detail: "No lengthy forms. No configuration. Just your idea.",
    Icon: FileText,
    gradientFrom: "#3B82F6",
    gradientTo: "#2563EB",
  },
  {
    number: "02",
    title: "Agents get to work",
    description: "10 specialised agents run in sequence: strategic direction, brand identity, site architecture, copy, assets, code recommendations, QA, critique, and optimisation.",
    detail: "Each agent does one thing — perfectly.",
    Icon: Cpu,
    gradientFrom: "#7C3AED",
    gradientTo: "#6D28D9",
  },
  {
    number: "03",
    title: "Download your project",
    description: "Receive a fully structured project: design system, complete copy, asset prompts, component architecture, recommended stack and an execution plan.",
    detail: "Production-ready. Nothing generic.",
    Icon: Download,
    gradientFrom: "#06D6A0",
    gradientTo: "#3B82F6",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-[#111827]/40">
      {/* Subtle top/bottom borders */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />

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
          <div className="hidden lg:block absolute top-14 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px">
            <div className="h-full bg-gradient-to-r from-blue-500/25 via-violet-500/25 to-emerald-400/25" />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="relative flex flex-col items-start lg:items-center lg:text-center">
                {/* Step number with icon */}
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg mb-6 ring-1 ring-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${step.gradientFrom}, ${step.gradientTo})`,
                    boxShadow: `0 8px 32px ${step.gradientFrom}30`,
                  }}
                >
                  <step.Icon className="size-7" strokeWidth={1.8} />
                </div>

                <span className="text-xs font-mono text-slate-600 mb-2">Step {step.number}</span>

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
            {AGENT_CONFIGS.map((agent, i) => (
              <div key={agent.id} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#111827] px-3 py-2 hover:border-slate-600 transition-colors">
                  <AgentIcon name={agent.icon} className="size-3.5" style={{ color: agent.color }} />
                  <span className="text-xs font-medium text-slate-300">{agent.name}</span>
                </div>
                {i < AGENT_CONFIGS.length - 1 && (
                  <ArrowRight className="size-3 text-slate-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
