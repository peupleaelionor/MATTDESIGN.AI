import type { ColorPalette, Typography } from "@/types";

// ─── MattDESIGN.AI v3 — Design Tokens ───────────────────────────────────────

export const DESIGN_TOKENS = {
  colors: {
    bg: "#0A0F1E",
    bgCard: "#111827",
    bgElevated: "#1E293B",
    border: "#1E293B",
    primary: "#3B82F6",
    primaryDim: "#1D4ED8",
    secondary: "#7C3AED",
    accent: "#06D6A0",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    textDim: "#64748B",
  },

  gradients: {
    primary: "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)",
    accent: "linear-gradient(135deg, #06D6A0 0%, #3B82F6 100%)",
    dark: "linear-gradient(180deg, #0A0F1E 0%, #111827 100%)",
  },

  spacing: {
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
  },

  radius: {
    sm: "0.375rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.4)",
    md: "0 4px 16px rgba(0,0,0,0.5)",
    lg: "0 8px 32px rgba(0,0,0,0.6)",
    glowBlue: "0 0 24px rgba(59,130,246,0.35)",
    glowViolet: "0 0 24px rgba(124,58,237,0.35)",
    glowAccent: "0 0 24px rgba(6,214,160,0.3)",
  },

  typography: {
    fontSans: "'Geist', system-ui, sans-serif",
    fontMono: "'Geist Mono', 'Fira Code', monospace",
    scale: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
    },
  },
} as const;

// ─── Default brand palette (MattDESIGN.AI own brand) ─────────────────────────

export const MD_BRAND_PALETTE: ColorPalette = {
  primary: "#3B82F6",
  secondary: "#7C3AED",
  accent: "#06D6A0",
  background: "#0A0F1E",
  surface: "#111827",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
};

export const MD_BRAND_TYPOGRAPHY: Typography = {
  heading: "Geist Sans",
  body: "Geist Sans",
  mono: "Geist Mono",
  scale: DESIGN_TOKENS.typography.scale,
};

// ─── Tones mapping ────────────────────────────────────────────────────────────

export const TONE_DESCRIPTORS: Record<string, string[]> = {
  professional: ["authoritative", "clear", "structured", "precise"],
  playful: ["energetic", "friendly", "light", "conversational"],
  bold: ["confident", "direct", "punchy", "impactful"],
  minimal: ["restrained", "quiet", "elegant", "clean"],
  luxury: ["refined", "exclusive", "premium", "sophisticated"],
};
