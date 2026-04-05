import {
  Dna,
  Bot,
  RefreshCw,
  Zap,
  ImagePlay,
  BrainCircuit,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, Badge } from "@/components/ui";

// ─── Features Section ─────────────────────────────────────────────────────────

interface Feature {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  badge: string;
  badgeVariant: "default" | "violet" | "accent" | "muted" | "warning" | "danger" | "success";
}

const FEATURES: Feature[] = [
  {
    icon: Dna,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    title: "Brand DNA Engine",
    description: "Complete visual identity in seconds — palette, typography, mood, personality and usage rules. Coherent from pixel one.",
    badge: "Core",
    badgeVariant: "default",
  },
  {
    icon: Bot,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    title: "Multi-Agent Pipeline",
    description: "10 specialised agents run in sequence. Director → Strategist → Designer → Copywriter → Builder → QA → Critic → Optimizer.",
    badge: "Architecture",
    badgeVariant: "violet",
  },
  {
    icon: RefreshCw,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    title: "Self-Improvement Loop",
    description: "The Critic scores output across 6 dimensions. The Optimizer fixes every weakness. Output improves automatically, every iteration.",
    badge: "Intelligence",
    badgeVariant: "accent",
  },
  {
    icon: Zap,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    title: "Production-Ready Code",
    description: "Clean Next.js + TypeScript + Tailwind output. Modular components, design system tokens, deployable immediately.",
    badge: "Dev",
    badgeVariant: "default",
  },
  {
    icon: ImagePlay,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    title: "Asset Prompt Library",
    description: "Every project gets precision Stable Diffusion / Midjourney prompts for hero images, OG cards, illustrations and icons.",
    badge: "Assets",
    badgeVariant: "warning",
  },
  {
    icon: BrainCircuit,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    title: "Memory System",
    description: "Learns from every project. Successful patterns are stored and reused. The system gets smarter with each generation.",
    badge: "Memory",
    badgeVariant: "violet",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="muted" className="mb-4">Features</Badge>
          <h2 className="md-heading text-3xl md:text-4xl lg:text-5xl text-white max-w-3xl">
            Everything a senior team would build.{" "}
            <span className="md-gradient-text">Automated.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl">
            10 specialised agents working in sequence — so you get studio-quality output without the studio cost.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                hover
                className="group flex flex-col gap-4 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${feature.iconColor}`} strokeWidth={1.5} />
                  </div>
                  <Badge variant={feature.badgeVariant}>{feature.badge}</Badge>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed flex-1">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
