import type { AgentConfig } from "@/types";

// ─── MattDESIGN.AI v3 — Agent Configuration ──────────────────────────────────

export const AGENT_CONFIGS: AgentConfig[] = [
  {
    id: "director",
    name: "Director",
    description: "Understands the brief, defines business intent, audience & priorities.",
    icon: "Crosshair",
    color: "#3B82F6",
    role: "Strategic leadership",
  },
  {
    id: "strategist",
    name: "Strategist",
    description: "Defines the project angle, conversion logic & user journey.",
    icon: "Compass",
    color: "#06D6A0",
    role: "Positioning & UX strategy",
  },
  {
    id: "brand-designer",
    name: "Brand Designer",
    description: "Creates the Brand DNA: name, tagline, palette, typography & visual identity.",
    icon: "Palette",
    color: "#7C3AED",
    role: "Visual identity",
  },
  {
    id: "ui-designer",
    name: "UI/UX Designer",
    description: "Designs the site architecture, navigation, sections & component system.",
    icon: "Layout",
    color: "#F59E0B",
    role: "Interface design",
  },
  {
    id: "asset-generator",
    name: "Asset Generator",
    description: "Lists all assets needed and writes production-ready image prompts.",
    icon: "ImagePlus",
    color: "#EC4899",
    role: "Visual asset production",
  },
  {
    id: "copywriter",
    name: "Copywriter",
    description: "Writes the full site copy: headlines, CTAs, benefits, FAQ & microcopy.",
    icon: "PenTool",
    color: "#14B8A6",
    role: "Conversion copywriting",
  },
  {
    id: "builder",
    name: "Builder",
    description: "Recommends the optimal free/freemium stack and execution mode.",
    icon: "Wrench",
    color: "#64748B",
    role: "Technical implementation",
  },
  {
    id: "qa-reviewer",
    name: "QA Reviewer",
    description: "Controls quality across design, copy, branding and mobile.",
    icon: "ShieldCheck",
    color: "#06D6A0",
    role: "Quality assurance",
  },
  {
    id: "critic",
    name: "Critic",
    description: "Scores the output across 6 dimensions and identifies blockers.",
    icon: "Eye",
    color: "#EF4444",
    role: "Output critique",
  },
  {
    id: "optimizer",
    name: "Optimizer",
    description: "Fixes issues found by the Critic and returns an improved version.",
    icon: "Sparkles",
    color: "#3B82F6",
    role: "Continuous improvement",
  },
];

export const AGENT_CONFIG_MAP = Object.fromEntries(
  AGENT_CONFIGS.map((c) => [c.id, c]),
) as Record<AgentConfig["id"], AgentConfig>;

// ─── Pipeline order ────────────────────────────────────────────────────────────

export const PIPELINE_ORDER: AgentConfig["id"][] = [
  "director",
  "strategist",
  "brand-designer",
  "ui-designer",
  "asset-generator",
  "copywriter",
  "builder",
  "qa-reviewer",
];
