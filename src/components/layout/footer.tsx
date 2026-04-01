import Link from "next/link";

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Generate", href: "/generate" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Agents", href: "/#agents" },
    { label: "GitHub", href: "https://github.com" },
  ],
  Stack: [
    { label: "Next.js", href: "https://nextjs.org" },
    { label: "Tailwind CSS", href: "https://tailwindcss.com" },
    { label: "Ollama", href: "https://ollama.com" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0A0F1E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-black text-white">
                M
              </span>
              <span className="font-bold text-white tracking-tight">
                MattDESIGN<span className="text-blue-400">.AI</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xs">
              The self-improving AI design system. From brief to production-ready site in minutes.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500">Open-source · Free-first</span>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MattDESIGN.AI — Open-source, free-first.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms</Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
