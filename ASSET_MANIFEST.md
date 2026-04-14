# Asset Manifest — MattDESIGN.AI v3

All assets used in this project are legally cleared. This manifest documents every asset, its source, and its license.

---

## Fonts

| Asset | Source | License | Usage |
|-------|--------|---------|-------|
| Geist Sans (variable) | [Vercel/Geist](https://vercel.com/font) | SIL Open Font License 1.1 | Primary heading & body typeface |
| Geist Mono (variable) | [Vercel/Geist](https://vercel.com/font) | SIL Open Font License 1.1 | Code blocks, labels, monospace UI |

## Icons

| Asset | Source | License | Usage |
|-------|--------|---------|-------|
| Lucide React (full set) | [lucide.dev](https://lucide.dev) | ISC License | All UI icons (navigation, features, agent cards, CTA) |

## UI Libraries

| Asset | Source | License | Usage |
|-------|--------|---------|-------|
| class-variance-authority | [joe-bell/cva](https://github.com/joe-bell/cva) | Apache-2.0 | Component variant management |
| clsx | [lukeed/clsx](https://github.com/lukeed/clsx) | MIT | Class name utility |
| tailwind-merge | [dcastil/tailwind-merge](https://github.com/dcastil/tailwind-merge) | MIT | Tailwind class conflict resolution |
| Framer Motion | [framer/motion](https://github.com/framer/motion) | MIT | Page transitions & animations |

## Framework & Build

| Asset | Source | License | Usage |
|-------|--------|---------|-------|
| Next.js 16 | [vercel/next.js](https://github.com/vercel/next.js) | MIT | Application framework |
| React 19 | [facebook/react](https://github.com/facebook/react) | MIT | UI rendering |
| Tailwind CSS v4 | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | MIT | Utility-first CSS |
| TypeScript 5 | [microsoft/TypeScript](https://github.com/microsoft/TypeScript) | Apache-2.0 | Type safety |

## Images & Visuals

| Asset | Source | License | Notes |
|-------|--------|---------|-------|
| `public/assets/logo.svg` | Custom (MattDESIGN.AI) | Proprietary | Horizontal logo with hexagonal icon + wordmark |
| `public/assets/logo-icon.svg` | Custom (MattDESIGN.AI) | Proprietary | App icon / avatar — rounded square with M mark |
| `public/assets/favicon.svg` | Custom (MattDESIGN.AI) | Proprietary | 32×32 minimal favicon |
| CSS-generated visuals | N/A | N/A | Gradients, patterns, glows — all in CSS |
| Lucide icons | [lucide.dev](https://lucide.dev) | ISC | All UI icons |

## Premium Static Pages

| Asset | Path | Description |
|-------|------|-------------|
| Landing Page | `public/premium/index.html` | Full 11-section premium landing page (52K) |
| Dashboard | `public/premium/dashboard.html` | 8-view navigable dashboard (47K) |
| Brand Guide | `public/premium/brand.html` | 7-section brand guide (28K) |
| Design System CSS | `public/premium/css/design-system.css` | 30+ CSS custom properties |
| Landing CSS | `public/premium/css/landing.css` | Landing page styles |
| Dashboard CSS | `public/premium/css/dashboard.css` | Dashboard styles |
| Brand CSS | `public/premium/css/brand.css` | Brand guide styles |
| Landing JS | `public/premium/js/landing.js` | Nav, reveal, FAQ, typewriter effects |
| Dashboard JS | `public/premium/js/dashboard.js` | View navigation, timer, DNA preview |

## Generated Assets (Pipeline Output)

When the pipeline generates asset prompts, they are intended for use with:

| Tool | License Model | Notes |
|------|---------------|-------|
| Stable Diffusion XL | CreativeML Open RAIL-M | Open-source model; output is owned by the user |
| Midjourney | User-owned (paid plans) | Commercial use allowed on paid plans |

---

## License Compliance Rules

1. **No copyrighted assets** — Every asset is open-source or permissively licensed
2. **No scraped images** — All visuals are CSS-generated or from licensed icon sets
3. **Attribution maintained** — License files included in `node_modules` for all packages
4. **User-generated content** — AI image prompts produce user-owned output when used with appropriate tools
5. **Font compliance** — Geist is loaded locally via `next/font`, compliant with SIL OFL

---

*Last updated: 2026-04-14*
