// ─── MattDESIGN.AI — License Manifest System ─────────────────────────────────
// Every asset used or generated must be tracked with its license status.

export type LicenseType =
  | "ai-generated"
  | "cc0"
  | "public-domain"
  | "mit"
  | "apache-2.0"
  | "cc-by-4.0"
  | "cc-by-sa-4.0"
  | "user-owned"
  | "stock-licensed"
  | "open-source"
  | "unknown";

export type AssetUsage =
  | "commercial"
  | "personal"
  | "editorial"
  | "restricted";

export interface LicenseEntry {
  id: string;
  assetName: string;
  assetType: "image" | "icon" | "font" | "illustration" | "video" | "audio" | "code" | "template";
  source: string;
  license: LicenseType;
  attribution?: string;
  allowedUsage: AssetUsage[];
  projectId?: string;
  verified: boolean;
  createdAt: string;
  notes?: string;
}

export interface LicenseManifest {
  entries: LicenseEntry[];
  lastUpdated: string;
  projectId?: string;
}

// ─── In-memory manifest store ────────────────────────────────────────────────

let _manifests: Map<string, LicenseManifest> = new Map();
let _entryCounter = 0;

/**
 * Create or update a license manifest for a project.
 */
export function addLicenseEntry(
  projectId: string,
  entry: Omit<LicenseEntry, "id" | "createdAt" | "projectId">,
): LicenseEntry {
  const manifest = _manifests.get(projectId) ?? {
    entries: [],
    lastUpdated: new Date().toISOString(),
    projectId,
  };

  const licenseEntry: LicenseEntry = {
    ...entry,
    id: `lic-${++_entryCounter}`,
    projectId,
    createdAt: new Date().toISOString(),
  };

  manifest.entries.push(licenseEntry);
  manifest.lastUpdated = new Date().toISOString();
  _manifests.set(projectId, manifest);

  return licenseEntry;
}

/**
 * Get the full license manifest for a project.
 */
export function getManifest(projectId: string): LicenseManifest {
  return _manifests.get(projectId) ?? {
    entries: [],
    lastUpdated: new Date().toISOString(),
    projectId,
  };
}

/**
 * Check if all assets in a project are legally safe.
 */
export function auditManifest(projectId: string): {
  safe: boolean;
  total: number;
  verified: number;
  unverified: number;
  unknownLicense: number;
  issues: string[];
} {
  const manifest = getManifest(projectId);
  const total = manifest.entries.length;
  const verified = manifest.entries.filter((e) => e.verified).length;
  const unverified = total - verified;
  const unknownLicense = manifest.entries.filter(
    (e) => e.license === "unknown",
  ).length;

  const issues: string[] = [];

  for (const entry of manifest.entries) {
    if (entry.license === "unknown") {
      issues.push(`"${entry.assetName}" has unknown license — must verify or replace`);
    }
    if (!entry.verified) {
      issues.push(`"${entry.assetName}" is not yet verified`);
    }
    if (
      entry.license === "cc-by-4.0" ||
      entry.license === "cc-by-sa-4.0"
    ) {
      if (!entry.attribution) {
        issues.push(
          `"${entry.assetName}" requires attribution but none provided`,
        );
      }
    }
  }

  return {
    safe: unknownLicense === 0 && unverified === 0 && issues.length === 0,
    total,
    verified,
    unverified,
    unknownLicense,
    issues,
  };
}

/**
 * Generate default license entries for AI-generated assets in a project.
 */
export function registerAIGeneratedAssets(
  projectId: string,
  assets: Array<{ name: string; type: LicenseEntry["assetType"] }>,
): LicenseEntry[] {
  return assets.map((asset) =>
    addLicenseEntry(projectId, {
      assetName: asset.name,
      assetType: asset.type,
      source: "MattDESIGN.AI — AI Generated",
      license: "ai-generated",
      allowedUsage: ["commercial", "personal"],
      verified: true,
      notes: "Original AI-generated asset. No third-party rights involved.",
    }),
  );
}

/**
 * Get all manifests across all projects.
 */
export function getAllManifests(): LicenseManifest[] {
  return Array.from(_manifests.values());
}

/**
 * Clear manifests (for testing).
 */
export function clearManifests(): void {
  _manifests = new Map();
  _entryCounter = 0;
}

// ─── Safe license types that allow commercial use ────────────────────────────

const SAFE_LICENSES: LicenseType[] = [
  "ai-generated",
  "cc0",
  "public-domain",
  "mit",
  "apache-2.0",
  "user-owned",
  "open-source",
];

/**
 * Check if a license type is commercially safe.
 */
export function isCommerciallySafe(license: LicenseType): boolean {
  return SAFE_LICENSES.includes(license);
}
