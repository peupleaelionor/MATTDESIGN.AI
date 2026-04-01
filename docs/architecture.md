# MattDESIGN.AI v3 — Architecture Documentation

## Overview

MattDESIGN.AI v3 is a self-improving multi-agent AI design system built as a
production-ready Next.js application. It transforms a one-line brief into a
complete, premium web project — brand DNA, copy, assets, code, and execution plan.

---

## System Architecture

```
User Input (Brief)
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                   Core Pipeline (Orchestrator)          │
│                                                         │
│  1. Director      → Analyse brief, define intent        │
│  2. Strategist    → Define angle, conversion logic      │
│  3. Brand Designer→ Create Brand DNA                    │
│  4. UI Designer   → Design site architecture            │
│  5. Asset Generator→ List assets, write image prompts   │
│  6. Copywriter    → Write all site copy                 │
│  7. Builder       → Recommend stack & execution plan    │
│  8. QA Reviewer   → Quality gate (score + issues)       │
│                         │                               │
│         ┌───────────────┘                               │
│         ▼                                               │
│  9. Critic        → Score output across 6 dimensions   │
│  10. Optimizer    → Fix issues, improve score           │
└─────────────────────────────────────────────────────────┘
       │
       ▼
  Memory Store     → Persist patterns, recall for next run
       │
       ▼
  Final Output     → Brand DNA + Structure + Copy + Assets + Stack + QA Report
```

---

## File Structure

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout (Header + Footer)
│   ├── globals.css             # Design system CSS tokens
│   ├── generate/
│   │   └── page.tsx            # Interactive generator UI
│   └── api/
│       └── generate/
│           └── route.ts        # POST /api/generate
│
├── agents/
│   └── index.ts                # All 10 agent implementations
│
├── core/
│   └── orchestrator.ts         # Pipeline runner & progress tracking
│
├── memory/
│   └── store.ts                # In-memory store (swap for Supabase)
│
├── prompts/
│   └── agents.ts               # LLM prompt templates per agent
│
├── components/
│   ├── ui/
│   │   └── index.tsx           # Button, Card, Badge, Input, Progress, ScoreRing
│   ├── layout/
│   │   ├── header.tsx          # Fixed navigation header
│   │   └── footer.tsx          # Site footer
│   └── sections/
│       ├── hero.tsx            # Hero section
│       ├── features.tsx        # Features grid
│       ├── how-it-works.tsx    # 3-step process
│       ├── agents.tsx          # Agent cards grid
│       └── cta.tsx             # CTA + Metrics sections
│
├── config/
│   ├── design-tokens.ts        # Design system tokens
│   └── agent-config.ts         # Agent metadata + pipeline order
│
├── lib/
│   └── utils.ts                # Utility functions (cn, uid, etc.)
│
├── types/
│   └── index.ts                # All TypeScript types
│
└── docs/
    └── architecture.md         # This file
```

---

## Design System

### Colour Palette

| Token           | Value     | Usage                    |
|-----------------|-----------|--------------------------|
| `--md-bg`       | `#0A0F1E` | Page background          |
| `--md-bg-card`  | `#111827` | Card backgrounds         |
| `--md-primary`  | `#3B82F6` | CTAs, links, highlights  |
| `--md-secondary`| `#7C3AED` | Secondary accent (violet)|
| `--md-accent`   | `#06D6A0` | Success, positive states |
| `--md-text`     | `#F8FAFC` | Primary text             |
| `--md-text-muted`| `#94A3B8` | Secondary text           |

### Typography

- **Heading**: Geist Sans (700, tracking: -0.02em)
- **Body**: Geist Sans (400–500, line-height: 1.6)
- **Mono**: Geist Mono (code blocks, labels)

### Spacing

8pt grid system. Base unit: `4px`.

---

## Agent System

Each agent is a pure TypeScript async function:

```typescript
async function runAgentName(
  ...inputs: TypedInputs
): Promise<AgentResult<TypedOutput>>
```

### Adding a new agent

1. Define its output type in `src/types/index.ts`
2. Implement the function in `src/agents/index.ts`
3. Add its config to `src/config/agent-config.ts`
4. Insert it into the pipeline in `src/core/orchestrator.ts`

---

## Memory System

The memory store (`src/memory/store.ts`) is a server-side singleton that:

- **Saves** high-scoring results as patterns
- **Recalls** best matching pattern for a given brief
- **Tracks** sector × tone combinations that yield good results

**Production upgrade**: Replace the in-memory store with Supabase:

```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
```

---

## Self-Improvement Loop

```
Pipeline completes (8 agents)
        ↓
Critic scores output (6 dimensions, 0-100 each)
        ↓
Optimizer fixes blockers + warnings
        ↓
Score gain applied (max +12 per iteration)
        ↓
Result saved to memory store
        ↓
Next run can recall and reuse patterns
```

---

## API Reference

### `POST /api/generate`

**Body** (JSON):
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

**Response**: `PipelineState` — see `src/types/index.ts`

---

## Tech Stack

| Layer   | Tool                    | Cost        |
|---------|-------------------------|-------------|
| Framework | Next.js 15            | Open-source |
| Language  | TypeScript 5          | Open-source |
| Styling   | Tailwind CSS v4       | Open-source |
| UI        | shadcn/ui patterns    | Open-source |
| Fonts     | Geist (Vercel)        | Free        |
| AI (local)| Ollama + models       | Open-source |
| Images    | Stable Diffusion XL   | Open-source |
| DB        | Supabase (optional)   | Freemium    |
| Deploy    | Vercel                | Freemium    |

---

## Extending the System

### Connect a real LLM

In `src/agents/index.ts`, each agent has a comment block where the mock
generator lives. Replace with an Ollama or OpenAI call:

```typescript
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  body: JSON.stringify({ model: "llama3", prompt: directorPrompt(brief) }),
})
```

### Add streaming

Convert `src/app/api/generate/route.ts` to use `ReadableStream` and update
the client to consume `EventSource` or `fetch` with streaming.

### Add authentication

Wrap API routes with a middleware check (Supabase Auth or NextAuth.js).

---

## QA Checklist

Before every release:

- [ ] All 10 agents return valid typed data
- [ ] Generate page works end-to-end (brief → results)
- [ ] Mobile layout is correct (< 640px)
- [ ] All colour tokens are consistent
- [ ] No console errors in production build
- [ ] Lighthouse performance score ≥ 90
- [ ] All CTA links are correct
- [ ] OG metadata is set
- [ ] Typography scale is respected
- [ ] Zero hardcoded colours (use CSS tokens)
