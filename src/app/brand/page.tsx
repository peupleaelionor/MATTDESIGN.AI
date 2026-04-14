import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Brand Guide — MattDESIGN.AI",
  description:
    "Guide de marque complet MattDESIGN.AI : logo, couleurs, typographie, composants, voix & ton.",
};

// ─── Brand Color Swatch ──────────────────────────────────────────────────────

function ColorSwatch({
  name,
  hex,
  token,
  className = "",
}: {
  name: string;
  hex: string;
  token: string;
  className?: string;
}) {
  return (
    <div className="group">
      <div
        className={`h-20 rounded-xl border border-white/[0.06] mb-3 transition-transform group-hover:scale-105 ${className}`}
        style={{ backgroundColor: hex }}
      />
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="text-xs text-slate-500 font-mono">{hex}</p>
      <p className="text-xs text-slate-600 font-mono">{token}</p>
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({
  number,
  title,
  id,
}: {
  number: string;
  title: string;
  id: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-8" id={id}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20">
        {number}
      </span>
      <h2 className="text-2xl sm:text-3xl font-bold text-white md-heading">
        {title}
      </h2>
    </div>
  );
}

// ─── Brand Guide Page ────────────────────────────────────────────────────────

export default function BrandGuidePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Cover */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Brand Guidelines
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white md-heading mb-4">
            Matt<span className="md-gradient-text">DESIGN</span>
            <span className="md-gradient-text-gold">.AI</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Guide de marque officiel — Identité visuelle, couleurs, typographie,
            composants et voix.
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-16 p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Sommaire
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { n: "01", label: "Identité", href: "#identity" },
              { n: "02", label: "Logo", href: "#logo" },
              { n: "03", label: "Couleurs", href: "#colors" },
              { n: "04", label: "Typographie", href: "#typography" },
              { n: "05", label: "Composants", href: "#components" },
              { n: "06", label: "Voix & Ton", href: "#voice" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
              >
                <span className="text-xs font-mono text-indigo-400">
                  {item.n}
                </span>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* SECTION 01: Identity */}
        <section className="mb-20">
          <SectionHeader number="01" title="Identité" id="identity" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                Positionnement
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                MattDESIGN.AI est le designer IA premium pour créer des sites qui
                inspirent confiance. De la stratégie au code, en passant par le
                branding et les assets — tout en quelques minutes.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                Cible
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Freelances, studios, startups et créateurs qui veulent un résultat
                professionnel sans avoir une équipe design complète.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                Valeurs
              </h3>
              <ul className="text-slate-300 text-sm space-y-2">
                <li>✦ Précision — Chaque détail compte</li>
                <li>✦ Confiance — Design qui inspire</li>
                <li>✦ Rapidité — Minutes, pas semaines</li>
                <li>✦ Qualité — Niveau studio premium</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                Promesse
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                &quot;Un brief. Un clic. Un site qui inspire confiance — avec le
                branding, les assets et le code, prêts à déployer.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 02: Logo */}
        <section className="mb-20">
          <SectionHeader number="02" title="Logo" id="logo" />

          {/* Logo showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-8 rounded-2xl bg-[#08090D] border border-white/[0.06] flex items-center justify-center">
              <Image
                src="/assets/logo.svg"
                alt="MattDESIGN.AI — Logo horizontal"
                width={200}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="p-8 rounded-2xl bg-[#08090D] border border-white/[0.06] flex items-center justify-center">
              <Image
                src="/assets/logo-icon.svg"
                alt="MattDESIGN.AI — Icon"
                width={64}
                height={64}
                className="h-16 w-16"
              />
            </div>
            <div className="p-8 rounded-2xl bg-[#08090D] border border-white/[0.06] flex items-center justify-center">
              <Image
                src="/assets/favicon.svg"
                alt="MattDESIGN.AI — Favicon"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
          </div>

          {/* Logo on light bg */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
              <Image
                src="/assets/logo.svg"
                alt="Logo on light background"
                width={200}
                height={40}
                className="h-10 w-auto invert"
              />
            </div>
            <div className="p-8 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
              <Image
                src="/assets/logo-icon.svg"
                alt="Icon on light background"
                width={64}
                height={64}
                className="h-16 w-16"
              />
            </div>
            <div className="p-8 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
              <Image
                src="/assets/favicon.svg"
                alt="Favicon on light background"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
          </div>

          {/* Anatomy */}
          <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">
              Anatomie du logo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="h-2 w-2 mt-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>
                  <strong className="text-white">Cadre hexagonal</strong> —
                  Structure, précision, architecture
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="h-2 w-2 mt-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>
                  <strong className="text-white">M décomposé</strong> — Lettre
                  stylisée en nœuds connectés
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="h-2 w-2 mt-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>
                  <strong className="text-white">Point central or</strong> —
                  Intelligence artificielle, cœur du système
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="h-2 w-2 mt-1.5 rounded-full bg-slate-400 shrink-0" />
                <span>
                  <strong className="text-white">Wordmark</strong> — Matt blanc,
                  DESIGN violet, .AI or
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 03: Colors */}
        <section className="mb-20">
          <SectionHeader number="03" title="Couleurs" id="colors" />

          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Palette principale
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <ColorSwatch
              name="Deep"
              hex="#08090D"
              token="--bg-deep"
              className="border-white/10"
            />
            <ColorSwatch name="Base" hex="#0B0D12" token="--bg-base" />
            <ColorSwatch name="Surface" hex="#11131A" token="--bg-surface" />
            <ColorSwatch name="Elevated" hex="#171A23" token="--bg-elevated" />
            <ColorSwatch name="Card" hex="#1C1F2E" token="--bg-card" />
          </div>

          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Accents
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <ColorSwatch
              name="Violet"
              hex="#6366F1"
              token="--accent-violet"
            />
            <ColorSwatch name="Blue" hex="#2563EB" token="--accent-blue" />
            <ColorSwatch name="Gold" hex="#D6B36A" token="--accent-gold" />
            <ColorSwatch
              name="Gold Light"
              hex="#F0D49A"
              token="--accent-gold-light"
            />
            <ColorSwatch name="Accent" hex="#06D6A0" token="--md-accent" />
          </div>

          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Dégradés officiels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div
                className="h-20 rounded-xl mb-3"
                style={{
                  background:
                    "linear-gradient(135deg, #6366F1 0%, #2563EB 60%, #1E40AF 100%)",
                }}
              />
              <p className="text-sm font-semibold text-white">Hero Gradient</p>
              <p className="text-xs text-slate-500 font-mono">
                --gradient-hero
              </p>
            </div>
            <div>
              <div
                className="h-20 rounded-xl mb-3"
                style={{
                  background:
                    "linear-gradient(135deg, #D6B36A 0%, #F0D49A 50%, #D6B36A 100%)",
                }}
              />
              <p className="text-sm font-semibold text-white">Gold Gradient</p>
              <p className="text-xs text-slate-500 font-mono">
                --gradient-gold
              </p>
            </div>
            <div>
              <div
                className="h-20 rounded-xl mb-3"
                style={{
                  background:
                    "linear-gradient(135deg, #06D6A0 0%, #3B82F6 100%)",
                }}
              />
              <p className="text-sm font-semibold text-white">
                Accent Gradient
              </p>
              <p className="text-xs text-slate-500 font-mono">
                --md-grad-accent
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 04: Typography */}
        <section className="mb-20">
          <SectionHeader number="04" title="Typographie" id="typography" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                Police principale
              </h3>
              <p className="text-3xl font-bold text-white mb-2">
                Inter / Geist
              </p>
              <p className="text-sm text-slate-400">
                Poids 300–800. Utilisée pour tous les textes, titres et
                interfaces.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                Police code
              </h3>
              <p className="text-3xl font-bold text-white mb-2 font-mono">
                Geist Mono
              </p>
              <p className="text-sm text-slate-400">
                Pour le code, données techniques, tokens et valeurs
                mono-espacées.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-6">
              Échelle typographique
            </h3>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-5xl font-bold text-white md-heading">
                  Display
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  clamp(48px, 7vw, 88px)
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-4xl font-bold text-white md-heading">
                  Heading 1
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  clamp(36px, 5vw, 64px)
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-3xl font-bold text-white">
                  Heading 2
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  clamp(28px, 4vw, 48px)
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-2xl font-semibold text-white">
                  Heading 3
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  clamp(20px, 3vw, 32px)
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-lg text-white">Body Large</span>
                <span className="text-xs text-slate-500 font-mono">
                  clamp(16px, 2vw, 20px)
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-base text-slate-300">Body</span>
                <span className="text-xs text-slate-500 font-mono">16px</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 05: Components */}
        <section className="mb-20">
          <SectionHeader number="05" title="Composants" id="components" />

          {/* Buttons */}
          <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06] mb-6">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">
              Boutons
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-blue-600 to-blue-800 text-white font-semibold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all">
                Primary <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/[0.04] text-white font-semibold text-sm border border-white/[0.09] backdrop-blur-xl hover:bg-white/[0.08] transition-all">
                Ghost
              </button>
              <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-amber-950 font-bold text-sm shadow-lg hover:shadow-amber-500/20 transition-all">
                Gold
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06] mb-6">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">
              Badges & Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Accent
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Gold
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Success
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs text-slate-400 bg-white/[0.06] border border-white/[0.06]">
                tag
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">
              Cards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#11131A] border border-white/[0.09] hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer group">
                <div className="h-2 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 mb-4" />
                <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  Card standard
                </h4>
                <p className="text-xs text-slate-500">
                  Hover pour voir l&apos;effet glow et border accent
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#171A23]/60 backdrop-blur-xl border border-white/[0.09]">
                <div className="h-2 w-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 mb-4" />
                <h4 className="text-sm font-semibold text-white mb-1">
                  Card glass
                </h4>
                <p className="text-xs text-slate-500">
                  Avec backdrop-filter blur et semi-transparence
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 06: Voice */}
        <section className="mb-20">
          <SectionHeader number="06" title="Voix & Ton" id="voice" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                ✓ À faire
              </h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li>Parler avec précision et confiance</li>
                <li>Utiliser un langage professionnel mais accessible</li>
                <li>Montrer le résultat, pas le processus technique</li>
                <li>Être concis — chaque mot compte</li>
                <li>Inspirer la confiance dès le premier contact</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">
                ✗ À éviter
              </h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li>Jargon technique inutile</li>
                <li>Promesses vagues ou exagérées</li>
                <li>Ton trop casual ou familier</li>
                <li>Explications longues sans valeur ajoutée</li>
                <li>Copier le style d&apos;autres marques</li>
              </ul>
            </div>
          </div>

          {/* Don'ts */}
          <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">
              Règles d&apos;utilisation du logo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Ne pas étirer ou déformer le logo",
                "Ne pas changer les couleurs du logo",
                "Ne pas placer sur fond chargé sans contraste",
                "Ne pas réduire en dessous de 24px de hauteur",
                "Ne pas ajouter d'ombre ou d'effets au logo",
                "Ne pas modifier les proportions du wordmark",
              ].map((rule) => (
                <div
                  key={rule}
                  className="flex items-start gap-2 text-sm text-slate-400"
                >
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/10 border border-indigo-500/20">
          <h2 className="text-2xl font-bold text-white mb-3">
            Version interactive complète
          </h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Consultez le brand guide complet avec toutes les sections
            interactives, incluant les showcases et exemples animés.
          </p>
          <Link
            href="/premium/brand.html"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-blue-600 to-blue-800 text-white font-semibold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            Voir le guide interactif <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
