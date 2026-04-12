"use client";

import type { PipelineResults } from "@/types";
import { Card, Badge, ScoreRing } from "@/components/ui";

// ─── Variants Comparison Panel ───────────────────────────────────────────────

interface VariantsComparisonProps {
  variants: Array<{
    id: string;
    name: string;
    results: Partial<PipelineResults>;
    score: number;
    style: string;
  }>;
  onSelect?: (variantId: string) => void;
}

export function VariantsComparison({ variants, onSelect }: VariantsComparisonProps) {
  if (variants.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-slate-400 text-sm">No variants generated yet.</p>
        <p className="text-slate-500 text-xs mt-1">
          Generate multiple versions to compare here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Variant Comparison</h3>
        <Badge variant="muted">{variants.length} variants</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variants.map((variant) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Single Variant Card ──────────────────────────────────────────────────────

function VariantCard({
  variant,
  onSelect,
}: {
  variant: VariantsComparisonProps["variants"][0];
  onSelect?: (id: string) => void;
}) {
  const brand = variant.results.brand;
  const copy = variant.results.copy;

  return (
    <Card
      hover
      className="cursor-pointer"
      onClick={() => onSelect?.(variant.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white text-sm">{variant.name}</h4>
          <Badge variant="violet" className="mt-1">{variant.style}</Badge>
        </div>
        <ScoreRing score={variant.score} size={48} />
      </div>

      {/* Brand preview */}
      {brand && (
        <div className="space-y-2 mb-3">
          <p className="text-xs text-slate-500">Palette</p>
          <div className="flex gap-1">
            {[
              brand.palette.primary,
              brand.palette.secondary,
              brand.palette.accent,
              brand.palette.background,
              brand.palette.surface,
            ].map((color, i) => (
              <div
                key={i}
                className="h-6 flex-1 rounded-sm first:rounded-l-md last:rounded-r-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Copy preview */}
      {copy && (
        <div className="space-y-1">
          <p className="text-xs text-slate-500">Hero</p>
          <p className="text-sm font-medium text-white leading-tight line-clamp-2">
            {copy.hero.headline}
          </p>
          <p className="text-xs text-slate-400 line-clamp-2">
            {copy.hero.subheadline}
          </p>
        </div>
      )}

      {/* Metrics */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1E293B]">
        <span className="text-xs text-slate-500">
          {variant.results.structure?.pages.length ?? 0} pages
        </span>
        <span className="text-xs text-slate-500">
          {variant.results.assets?.length ?? 0} assets
        </span>
        <span className="text-xs text-slate-500">
          {Object.keys(variant.results.copy?.sections ?? {}).length} sections
        </span>
      </div>
    </Card>
  );
}
