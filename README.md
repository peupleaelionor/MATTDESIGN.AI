<p align="center">
  <strong>MattDESIGN.AI</strong> — The Self-Improving AI Design System
</p>

<p align="center">
  From a one-line brief to a production-ready website.<br/>
  10 AI agents. Brand DNA, copy, assets, code — in minutes.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#how-it-works">How It Works</a> ·
  <a href="#agents">Agents</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="docs/architecture.md">Architecture</a>
</p>

---

## What is MattDESIGN.AI?

MattDESIGN.AI is an autonomous multi-agent design system that transforms a project brief into a complete, premium web project — brand identity, site copy, asset prompts, component architecture, and execution plan.

It is **not** a template. Each output is generated fresh from your brief, critiqued automatically, and improved before delivery.

### Key features

- **10 specialised AI agents** — Director, Strategist, Brand Designer, UI/UX Designer, Asset Generator, Copywriter, Builder, QA Reviewer, Critic, Optimizer
- **Self-improvement loop** — The Critic scores every output across 6 dimensions; the Optimizer fixes weaknesses automatically
- **Memory system** — Successful patterns are stored and reused, so the system improves over time
- **Production-ready code** — Next.js + TypeScript + Tailwind CSS output with modular components and design tokens
- **Legal-first assets** — Only open-source fonts, icons, and CC0/permissive assets; full manifest included

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/peupleaelionor/MATTDESIGN.AI.git
cd MATTDESIGN.AI

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page, or visit [/generate](http://localhost:3000/generate) to create a project.

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Create optimised production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## How It Works

```
Brief → Director → Strategist → Brand Designer → UI Designer →
Asset Generator → Copywriter → Builder → QA → Critic → Optimizer → Output
```

1. **You provide a brief** — project name, description, sector, audience, tone
2. **10 agents run in sequence** — each one is an expert in its domain
3. **QA reviews the output** — scores across 6 quality dimensions
4. **Critic evaluates deeper** — identifies blockers and weak points
5. **Optimizer improves** — fixes issues and boosts the score
6. **Memory stores the result** — successful patterns are reused next time

---

## Agents

| # | Agent | Role | Output |
|---|-------|------|--------|
| 01 | **Director** | Strategic leadership | Objective, audience, positioning, creative angle |
| 02 | **Strategist** | Positioning & UX strategy | Conversion goals, pain points, differentiators, user journey |
| 03 | **Brand Designer** | Visual identity | Name support, tagline, palette, typography, mood, visual rules |
| 04 | **UI/UX Designer** | Interface design | Site structure, pages, navigation, sections, component list |
| 05 | **Asset Generator** | Visual asset production | Asset specifications, Stable Diffusion / Midjourney prompts |
| 06 | **Copywriter** | Conversion copywriting | Hero copy, feature sections, FAQ, microcopy, meta tags |
| 07 | **Builder** | Technical implementation | Tech stack recommendation, 7-phase execution plan |
| 08 | **QA Reviewer** | Quality assurance | Score across 6 dimensions, blockers, warnings |
| 09 | **Critic** | Output critique | Stricter scoring, strategic + brand + copy + UX evaluation |
| 10 | **Optimizer** | Continuous improvement | Applied fixes, score gain summary |

---

## Tech Stack

| Layer | Tool | License |
|-------|------|---------|
| Framework | Next.js 16 | MIT |
| Language | TypeScript 5 | Apache-2.0 |
| Styling | Tailwind CSS v4 | MIT |
| Icons | Lucide React | ISC |
| Fonts | Geist (Vercel) | SIL OFL 1.1 |
| Animations | Framer Motion | MIT |
| AI (local) | Ollama + models | Open-source |
| Images | Stable Diffusion XL | CreativeML Open RAIL-M |

---

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Design system CSS tokens
│   ├── generate/page.tsx    # Interactive generator UI
│   └── api/generate/        # POST /api/generate endpoint
├── agents/index.ts          # All 10 agent implementations
├── core/orchestrator.ts     # Pipeline runner & progress
├── memory/store.ts          # Pattern store (in-memory, Supabase-ready)
├── prompts/agents.ts        # LLM prompt templates
├── components/
│   ├── ui/index.tsx         # Button, Card, Badge, Input, Progress, ScoreRing
│   ├── agent-icon.tsx       # Lucide icon mapper for agents
│   ├── layout/              # Header, Footer
│   └── sections/            # Hero, Features, HowItWorks, Agents, CTA
├── config/
│   ├── design-tokens.ts     # Colour, spacing, shadow tokens
│   └── agent-config.ts      # Agent metadata & pipeline order
├── lib/utils.ts             # cn(), uid(), sleep(), scoreToColor()
└── types/index.ts           # All TypeScript interfaces
```

---

## API

### `POST /api/generate`

```json
{
  "projectName": "Acme Studio",
  "description": "AI-powered logo generator for startups",
  "sector": "SaaS",
  "audience": "Startup founders",
  "tone": "professional",
  "lang": "en",
  "style": "minimal dark",
  "goals": ["Generate leads", "Build credibility"]
}
```

Returns a `PipelineState` object with all agent outputs, critique, and improvements.

---

## Design System

- **Background**: `#0A0F1E` (dark premium)
- **Primary**: `#3B82F6` (blue)
- **Secondary**: `#7C3AED` (violet)
- **Accent**: `#06D6A0` (emerald)
- **Typography**: Geist Sans + Geist Mono
- **Spacing**: 8pt grid
- **Mode**: Dark-first

All tokens are defined as CSS custom properties in `globals.css` and mirrored in `src/config/design-tokens.ts`.

---

## Extending

### Connect a real LLM

Replace the mock generators in `src/agents/index.ts` with Ollama or OpenAI calls:

```typescript
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  body: JSON.stringify({ model: "llama3", prompt: directorPrompt(brief) }),
});
```

### Add persistent memory

Replace the in-memory store in `src/memory/store.ts` with Supabase or any database.

### Add authentication

Wrap API routes with middleware (Supabase Auth, NextAuth, Clerk).

---

## Documentation

- [Architecture](docs/architecture.md) — System design, agent flow, memory system
- [Asset Manifest](ASSET_MANIFEST.md) — License metadata for all assets
- [Section Registry](SECTION_REGISTRY.md) — Reusable UI component catalogue

---

## License

[MIT](LICENSE) — Free to use, modify, and distribute.
