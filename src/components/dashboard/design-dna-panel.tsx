"use client";

import { useState } from "react";
import type { BrandDNA } from "@/types";
import { Card, Badge } from "@/components/ui";

// ─── Design DNA Panel ────────────────────────────────────────────────────────

interface DesignDNAPanelProps {
  brand: BrandDNA;
}

export function DesignDNAPanel({ brand }: DesignDNAPanelProps) {
  const [activeSection, setActiveSection] = useState<string>("palette");

  const sections = [
    { id: "palette", label: "Palette" },
    { id: "typography", label: "Typography" },
    { id: "personality", label: "Personality" },
    { id: "rules", label: "Rules" },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{brand.name}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{brand.tagline}</p>
        </div>
        <Badge variant="accent">{brand.tone}</Badge>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mb-4">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSection === s.id
                ? "bg-blue-500/20 text-blue-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Palette */}
      {activeSection === "palette" && (
        <div className="space-y-3">
          <PaletteRow label="Primary" color={brand.palette.primary} />
          <PaletteRow label="Secondary" color={brand.palette.secondary} />
          <PaletteRow label="Accent" color={brand.palette.accent} />
          <PaletteRow label="Background" color={brand.palette.background} />
          <PaletteRow label="Surface" color={brand.palette.surface} />
          <PaletteRow label="Text" color={brand.palette.text} />
          <PaletteRow label="Text Muted" color={brand.palette.textMuted} />
        </div>
      )}

      {/* Typography */}
      {activeSection === "typography" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Heading</span>
            <span className="text-sm font-medium text-white" style={{ fontFamily: brand.typography.heading }}>
              {brand.typography.heading}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Body</span>
            <span className="text-sm text-white" style={{ fontFamily: brand.typography.body }}>
              {brand.typography.body}
            </span>
          </div>
          {brand.typography.mono && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Mono</span>
              <code className="text-sm text-white">{brand.typography.mono}</code>
            </div>
          )}
          <div className="border-t border-[#1E293B] pt-3 mt-3">
            <p className="text-xs text-slate-500 mb-2">Type Scale</p>
            {Object.entries(brand.typography.scale).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-0.5">
                <span className="text-xs text-slate-500">{key}</span>
                <span className="text-xs font-mono text-slate-400">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personality */}
      {activeSection === "personality" && (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-500 mb-2">Personality Traits</p>
            <div className="flex flex-wrap gap-2">
              {brand.personality.map((trait) => (
                <Badge key={trait} variant="violet">{trait}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Mood</p>
            <p className="text-sm text-white">{brand.mood}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Visual Style</p>
            <p className="text-sm text-white">{brand.visualStyle}</p>
          </div>
        </div>
      )}

      {/* Rules */}
      {activeSection === "rules" && (
        <ul className="space-y-2">
          {brand.rules.map((rule, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-blue-400 flex-shrink-0">•</span>
              <span className="text-slate-300">{rule}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ─── Palette Row ──────────────────────────────────────────────────────────────

function PaletteRow({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-8 rounded-md border border-[#1E293B] flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <code className="text-xs font-mono text-slate-500">{color}</code>
      </div>
    </div>
  );
}
