import { Card, Badge } from "@/components/ui";
import { Dna, Bot, RefreshCw, Code2, ImagePlus, Brain } from "lucide-react";
import type { FC } from "react";
import type { LucideProps } from "lucide-react";

// ─── Features Section ─────────────────────────────────────────────────────────

const FEATURES: {
  Icon: FC<LucideProps>;
  title: string;
  description: string;
  badge: string;
  badgeVariant: "default" | "violet" | "accent" | "muted" | "warning" | "danger" | "success";
  iconColor: string;
  glowColor: string;
}[] = [
  {
    Icon: Dna,
    title: "Brand DNA Engine",
    description: "Complete visual identity in seconds — palette, typography, mood, personality and usage rules. Coherent from pixel one.",
    badge: "Core",
    badgeVariant: "default",
    iconColor: "#3B82F6",
    glowColor: "rgba(59,130,246,0.12)",
  },
  {
    Icon: Bot,
    title: "Multi-Agent Pipeline",
    description: "10 specialised agents run in sequence. Director → Strategist → Designer → Copywriter → Builder → QA → Critic → Optimizer.",
    badge: "Architecture",
    badgeVariant: "violet",
    iconColor: "#7C3AED",
    glowColor: "rgba(124,58,237,0.12)",
  },
  {
    Icon: RefreshCw,
    title: "Self-Improvement Loop",
    description: "The Critic scores output across 6 dimensions. The Optimizer fixes every weakness. Output improves automatically, every iteration.",
    badge: "Intelligence",
    badgeVariant: "accent",
    iconColor: "#06D6A0",
    glowColor: "rgba(6,214,160,0.12)",
  },
  {
    Icon: Code2,
    title: "Production-Ready Code",
    description: "Clean Next.js + TypeScript + Tailwind output. Modular components, design system tokens, deployable immediately.",
    badge: "Dev",
    badgeVariant: "default",
    iconColor: "#3B82F6",
    glowColor: "rgba(59,130,246,0.12)",
  },
  {
    Icon: ImagePlus,
    title: "Asset Prompts Library",
    description: "Every project gets precise Stable Diffusion / Midjourney prompts for hero images, OG social cards, illustrations and icons.",
    badge: "Assets",
    badgeVariant: "warning",
    iconColor: "#F59E0B",
    glowColor: "rgba(245,158,11,0.12)",
  },
  {
    Icon: Brain,
    title: "Memory System",
    description: "Learns from every project. Successful patterns are stored and reused. The system gets smarter with each generation.",
    badge: "Memory",
    badgeVariant: "violet",
    iconColor: "#7C3AED",
    glowColor: "rgba(124,58,237,0.12)",
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
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              hover
              className="group flex flex-col gap-5"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex items-center justify-center h-11 w-11 rounded-xl transition-shadow"
                  style={{
                    background: feature.glowColor,
                    boxShadow: `0 0 0 1px ${feature.iconColor}20`,
                  }}
                >
                  <feature.Icon className="size-5" style={{ color: feature.iconColor }} />
                </div>
                <Badge variant={feature.badgeVariant}>{feature.badge}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed -mt-1">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
