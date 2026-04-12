// ─── MattDESIGN.AI — Export Utilities ─────────────────────────────────────────
// Export project data in multiple formats for GitHub-ready output.

import type { PipelineState, PipelineResults, BrandDNA } from "@/types";
import { getManifest } from "@/lib/license-manifest";

// ─── Export Types ─────────────────────────────────────────────────────────────

export type ExportFormat = "json" | "markdown" | "text";

export interface ExportBundle {
  projectName: string;
  exportedAt: string;
  format: ExportFormat;
  sections: ExportSection[];
}

export interface ExportSection {
  name: string;
  content: string;
  filename: string;
}

// ─── Full Project Export ──────────────────────────────────────────────────────

export function exportProject(
  state: PipelineState,
  format: ExportFormat = "json",
): ExportBundle {
  const results = state.results as Partial<PipelineResults>;
  const sections: ExportSection[] = [];

  if (format === "json") {
    sections.push({
      name: "Full Project Data",
      content: JSON.stringify(
        {
          brief: state.brief,
          results: state.results,
          critique: state.critique,
          improvement: state.improvement,
          completedAt: state.completedAt,
        },
        null,
        2,
      ),
      filename: "project.json",
    });
  }

  if (format === "markdown" || format === "text") {
    // Brand DNA
    if (results.brand) {
      sections.push({
        name: "Brand DNA",
        content: exportBrandDNA(results.brand),
        filename: "brand-dna.md",
      });
    }

    // Copy
    if (results.copy) {
      sections.push({
        name: "Site Copy",
        content: exportCopy(results.copy),
        filename: "site-copy.md",
      });
    }

    // Structure
    if (results.structure) {
      sections.push({
        name: "Site Structure",
        content: exportStructure(results.structure),
        filename: "site-structure.md",
      });
    }

    // Asset Prompts
    if (results.prompts) {
      sections.push({
        name: "Asset Prompts",
        content: exportPrompts(results.prompts),
        filename: "asset-prompts.md",
      });
    }

    // License Manifest
    const manifest = getManifest(state.id);
    if (manifest.entries.length > 0) {
      sections.push({
        name: "License Manifest",
        content: exportLicenseManifest(manifest),
        filename: "license-manifest.md",
      });
    }

    // Tech Stack
    if (results.stack) {
      sections.push({
        name: "Tech Stack",
        content: exportStack(results.stack),
        filename: "tech-stack.md",
      });
    }
  }

  return {
    projectName: state.brief.projectName,
    exportedAt: new Date().toISOString(),
    format,
    sections,
  };
}

// ─── Section Exporters ───────────────────────────────────────────────────────

function exportBrandDNA(brand: BrandDNA): string {
  const lines = [
    `# Brand DNA — ${brand.name}`,
    "",
    `**Tagline:** ${brand.tagline}`,
    `**Tone:** ${brand.tone}`,
    `**Mood:** ${brand.mood}`,
    `**Visual Style:** ${brand.visualStyle}`,
    "",
    "## Personality",
    ...brand.personality.map((p) => `- ${p}`),
    "",
    "## Color Palette",
    `- Primary: ${brand.palette.primary}`,
    `- Secondary: ${brand.palette.secondary}`,
    `- Accent: ${brand.palette.accent}`,
    `- Background: ${brand.palette.background}`,
    `- Surface: ${brand.palette.surface}`,
    `- Text: ${brand.palette.text}`,
    `- Text Muted: ${brand.palette.textMuted}`,
    "",
    "## Typography",
    `- Heading: ${brand.typography.heading}`,
    `- Body: ${brand.typography.body}`,
    ...(brand.typography.mono ? [`- Mono: ${brand.typography.mono}`] : []),
    "",
    "## Rules",
    ...brand.rules.map((r) => `- ${r}`),
  ];
  return lines.join("\n");
}

function exportCopy(copy: import("@/types").SiteCopy): string {
  const lines = [
    "# Site Copy",
    "",
    "## Meta",
    `**Title:** ${copy.meta.title}`,
    `**Description:** ${copy.meta.description}`,
    "",
    "## Hero",
    `**Headline:** ${copy.hero.headline}`,
    `**Subheadline:** ${copy.hero.subheadline}`,
    `**CTA:** ${copy.hero.cta.primary}`,
    ...(copy.hero.proof ? [`**Proof:** ${copy.hero.proof}`] : []),
    "",
    "## Sections",
  ];

  for (const [id, section] of Object.entries(copy.sections)) {
    lines.push(`### ${id}`);
    lines.push(`**Headline:** ${section.headline}`);
    if (section.subheadline) lines.push(`**Subheadline:** ${section.subheadline}`);
    if (section.body) lines.push(`\n${section.body}`);
    if (section.items) {
      for (const item of section.items) {
        lines.push(`- **${item.title}:** ${item.description}`);
      }
    }
    lines.push("");
  }

  lines.push("## Footer");
  lines.push(`**Tagline:** ${copy.footer.tagline}`);
  lines.push(`**Legal:** ${copy.footer.legal}`);

  return lines.join("\n");
}

function exportStructure(
  structure: import("@/types").SiteStructure,
): string {
  const lines = [
    "# Site Structure",
    "",
    "## Pages",
  ];

  for (const page of structure.pages) {
    lines.push(`### ${page.title} (\`${page.slug}\`)`);
    lines.push(`Sections: ${page.sections.join(", ")}`);
    lines.push("");
  }

  lines.push("## Navigation");
  for (const nav of structure.navigation) {
    lines.push(`- [${nav.label}](${nav.href})`);
  }

  lines.push("");
  lines.push("## Components");
  for (const comp of structure.components) {
    lines.push(`- ${comp}`);
  }

  return lines.join("\n");
}

function exportPrompts(
  prompts: import("@/types").ImagePrompt[],
): string {
  const lines = ["# Asset Prompts", ""];

  for (const prompt of prompts) {
    lines.push(`## ${prompt.name}`);
    lines.push(`**Style:** ${prompt.style}`);
    lines.push(`**Dimensions:** ${prompt.dimensions}`);
    if (prompt.model) lines.push(`**Model:** ${prompt.model}`);
    lines.push("");
    lines.push("```");
    lines.push(prompt.prompt);
    lines.push("```");
    if (prompt.negativePrompt) {
      lines.push("");
      lines.push("**Negative prompt:**");
      lines.push("```");
      lines.push(prompt.negativePrompt);
      lines.push("```");
    }
    lines.push("");
  }

  return lines.join("\n");
}

function exportLicenseManifest(
  manifest: import("@/lib/license-manifest").LicenseManifest,
): string {
  const lines = [
    "# License Manifest",
    "",
    `Last updated: ${manifest.lastUpdated}`,
    "",
    "| Asset | Type | License | Source | Verified |",
    "|-------|------|---------|--------|----------|",
  ];

  for (const entry of manifest.entries) {
    lines.push(
      `| ${entry.assetName} | ${entry.assetType} | ${entry.license} | ${entry.source} | ${entry.verified ? "✓" : "✗"} |`,
    );
  }

  return lines.join("\n");
}

function exportStack(
  stack: import("@/types").TechStack,
): string {
  const lines = ["# Tech Stack", ""];
  const categories = [
    { name: "Design", tools: stack.design },
    { name: "AI", tools: stack.ai },
    { name: "Build", tools: stack.build },
    { name: "Storage", tools: stack.storage },
    { name: "Deploy", tools: stack.deploy },
  ];

  for (const cat of categories) {
    lines.push(`## ${cat.name}`);
    for (const tool of cat.tools) {
      lines.push(
        `- **${tool.name}** — ${tool.purpose} (${tool.cost})${tool.url ? ` [→](${tool.url})` : ""}`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}
