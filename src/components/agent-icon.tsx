import {
  Crosshair,
  Compass,
  Palette,
  Layout,
  ImagePlus,
  PenTool,
  Wrench,
  ShieldCheck,
  Eye,
  Sparkles,
  type LucideProps,
} from "lucide-react";
import type { FC } from "react";

const ICON_MAP: Record<string, FC<LucideProps>> = {
  Crosshair,
  Compass,
  Palette,
  Layout,
  ImagePlus,
  PenTool,
  Wrench,
  ShieldCheck,
  Eye,
  Sparkles,
};

interface AgentIconProps extends LucideProps {
  name: string;
}

export function AgentIcon({ name, ...props }: AgentIconProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <span>{name}</span>;
  return <Icon {...props} />;
}
