"use client";

import { useState } from "react";
import type { PipelineState } from "@/types";
import { Card, Button, Badge } from "@/components/ui";
import { exportProject, type ExportFormat } from "@/lib/export";
import { Download, Copy, FileText, FileJson, Check } from "lucide-react";

// ─── Export Panel ─────────────────────────────────────────────────────────────

interface ExportPanelProps {
  state: PipelineState;
}

export function ExportPanel({ state }: ExportPanelProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleExport = (format: ExportFormat) => {
    const bundle = exportProject(state, format);

    if (format === "json") {
      // Download as single JSON file
      const content = bundle.sections[0]?.content ?? "{}";
      downloadFile(content, `${bundle.projectName}.json`, "application/json");
    } else {
      // Download each section as separate file
      for (const section of bundle.sections) {
        downloadFile(
          section.content,
          section.filename,
          "text/markdown",
        );
      }
    }
  };

  const handleCopySection = async (name: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(name);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // Fallback: create temporary textarea
      const ta = document.createElement("textarea");
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedSection(name);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const mdBundle = exportProject(state, "markdown");

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Export Project</h3>
        <Badge variant="accent">
          {state.brief.projectName}
        </Badge>
      </div>

      {/* Quick export buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          size="sm"
          variant="primary"
          leftIcon={<FileJson className="h-4 w-4" />}
          onClick={() => handleExport("json")}
        >
          Export JSON
        </Button>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<FileText className="h-4 w-4" />}
          onClick={() => handleExport("markdown")}
        >
          Export Markdown
        </Button>
      </div>

      {/* Individual sections */}
      <div className="space-y-3">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
          Copy Individual Sections
        </p>
        {mdBundle.sections.map((section) => (
          <div
            key={section.name}
            className="flex items-center justify-between py-2 px-3 rounded-lg border border-[#1E293B] hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-300">{section.name}</span>
              <span className="text-xs text-slate-600">{section.filename}</span>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopySection(section.name, section.content)}
                leftIcon={
                  copiedSection === section.name ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )
                }
              >
                {copiedSection === section.name ? "Copied" : "Copy"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  downloadFile(
                    section.content,
                    section.filename,
                    "text/markdown",
                  )
                }
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Save
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Download Helper ──────────────────────────────────────────────────────────

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
