"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

// ─── Header ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Agents", href: "/#agents" },
  { label: "Docs", href: "/docs" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1E293B]/60 bg-[#0A0F1E]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-black text-white shadow-lg group-hover:shadow-blue-500/40 transition-all">
            M
          </span>
          <span className="font-bold text-white tracking-tight">
            MattDESIGN<span className="text-blue-400">.AI</span>
          </span>
          <Badge variant="violet" className="hidden sm:inline-flex">v3</Badge>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/generate">
            <Button size="md" variant="primary">
              Generate →
            </Button>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={cn(
            "block w-5 relative",
            "before:absolute before:top-[-6px] before:left-0 before:h-0.5 before:w-full before:bg-current before:transition-transform",
            "after:absolute after:top-[6px] after:left-0 after:h-0.5 after:w-full after:bg-current after:transition-transform",
            "h-0.5 bg-current",
            mobileOpen && "bg-transparent before:top-0 before:rotate-45 after:top-0 after:-rotate-45",
          )} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1E293B] bg-[#0A0F1E] px-4 py-4">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-[#1E293B]">
            <Link href="/generate" onClick={() => setMobileOpen(false)}>
              <Button className="w-full" size="md" variant="primary">
                Generate →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
