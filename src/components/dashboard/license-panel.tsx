"use client";

import { Card, Badge } from "@/components/ui";
import type { LicenseManifest } from "@/lib/license-manifest";
import { isCommerciallySafe } from "@/lib/license-manifest";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

// ─── License Panel ───────────────────────────────────────────────────────────

interface LicensePanelProps {
  manifest: LicenseManifest;
  audit: {
    safe: boolean;
    total: number;
    verified: number;
    unverified: number;
    unknownLicense: number;
    issues: string[];
  };
}

export function LicensePanel({ manifest, audit }: LicensePanelProps) {
  const StatusIcon = audit.safe
    ? ShieldCheck
    : audit.unknownLicense > 0
      ? ShieldX
      : ShieldAlert;

  const statusColor = audit.safe
    ? "text-green-400"
    : audit.unknownLicense > 0
      ? "text-red-400"
      : "text-amber-400";

  const statusLabel = audit.safe
    ? "All Clear"
    : audit.unknownLicense > 0
      ? "Action Required"
      : "Review Needed";

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">License Manifest</h3>
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-5 w-5 ${statusColor}`} />
          <span className={`text-sm font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatBox label="Total" value={audit.total} />
        <StatBox label="Verified" value={audit.verified} color="text-green-400" />
        <StatBox label="Unverified" value={audit.unverified} color="text-amber-400" />
        <StatBox label="Unknown" value={audit.unknownLicense} color="text-red-400" />
      </div>

      {/* Issues */}
      {audit.issues.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs font-medium text-amber-400 mb-2">Issues</p>
          <ul className="space-y-1">
            {audit.issues.slice(0, 5).map((issue, i) => (
              <li key={i} className="text-xs text-amber-300/80">
                • {issue}
              </li>
            ))}
            {audit.issues.length > 5 && (
              <li className="text-xs text-amber-300/60">
                +{audit.issues.length - 5} more issues
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Entries list */}
      {manifest.entries.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Assets ({manifest.entries.length})
          </p>
          {manifest.entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg border border-[#1E293B]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-slate-300 truncate">
                  {entry.assetName}
                </span>
                <Badge
                  variant={
                    isCommerciallySafe(entry.license) ? "success" : "warning"
                  }
                >
                  {entry.license}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-slate-500">{entry.assetType}</span>
                {entry.verified ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-4">
          No assets registered yet.
        </p>
      )}
    </Card>
  );
}

// ─── Stat Box ─────────────────────────────────────────────────────────────────

function StatBox({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="text-center py-2 px-1 rounded-lg bg-[#0A0F1E] border border-[#1E293B]">
      <p className={`text-lg font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
