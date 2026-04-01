# Section Registry — MattDESIGN.AI v3

Reusable UI sections and components. Each section is a standalone React component that can be composed into any page.

---

## Page Sections

### HeroSection
- **File**: `src/components/sections/hero.tsx`
- **Purpose**: Primary landing hero with headline, subheadline, CTAs, proof points, and terminal mockup
- **Props**: None (self-contained)
- **Features**: Gradient orbs, grid background, noise texture, animated badge, gradient border terminal preview
- **Best for**: Landing page above-the-fold

### MetricsSection
- **File**: `src/components/sections/cta.tsx` (co-exported)
- **Purpose**: Key metrics/social proof strip
- **Props**: None (self-contained)
- **Features**: 4-column grid, gradient text values, gradient border separators
- **Best for**: Social proof between hero and features

### FeaturesSection
- **File**: `src/components/sections/features.tsx`
- **Purpose**: 6-card feature grid with icons and badges
- **Props**: None (self-contained)
- **Features**: Lucide icons with colored containers, hover animations, badge variants
- **Best for**: Value proposition and feature showcase

### HowItWorksSection
- **File**: `src/components/sections/how-it-works.tsx`
- **Purpose**: 3-step process explanation with pipeline flow diagram
- **Props**: None (self-contained)
- **Features**: Numbered steps with gradient icons, connector line, pipeline chip flow
- **Best for**: Explaining the product workflow

### AgentsSection
- **File**: `src/components/sections/agents.tsx`
- **Purpose**: 10-agent card grid showing the AI team
- **Props**: None (self-contained)
- **Features**: Lucide icons, glow accents, animated color lines, agent metadata from config
- **Best for**: Showcasing the multi-agent architecture

### CTASection
- **File**: `src/components/sections/cta.tsx`
- **Purpose**: Final conversion section with CTA buttons and trust signals
- **Props**: None (self-contained)
- **Features**: Glass card, gradient backgrounds, trust signal icons, dual CTA buttons
- **Best for**: Page-closing conversion block

---

## Layout Components

### Header
- **File**: `src/components/layout/header.tsx`
- **Purpose**: Fixed top navigation with logo, links, CTA, mobile menu
- **Client component**: Yes (mobile toggle state)
- **Features**: Backdrop blur, gradient logo, responsive burger menu

### Footer
- **File**: `src/components/layout/footer.tsx`
- **Purpose**: Site footer with link groups, brand, and legal links
- **Features**: 4-column grid, status indicator, external link handling

---

## UI Primitives

All in `src/components/ui/index.tsx`:

| Component | Variants | Usage |
|-----------|----------|-------|
| **Button** | primary, secondary, outline, ghost, accent, danger × sm, md, lg, xl, icon | CTAs, nav, forms |
| **Badge** | default, violet, accent, muted, warning, danger, success + dot | Labels, tags, status |
| **Card** | hover, glow (blue/violet/accent), glass | Content containers |
| **Input** | label, error, hint | Form text inputs |
| **Textarea** | label, error, hint | Form text areas |
| **Select** | label, error, options | Form dropdowns |
| **Progress** | default, accent, violet × sm, md | Progress bars |
| **Divider** | — | Section separators |
| **ScoreRing** | size, dynamic color | Quality scores |

---

## Utility Component

### AgentIcon
- **File**: `src/components/agent-icon.tsx`
- **Purpose**: Maps agent icon name strings to Lucide React components
- **Props**: `name: string` + all `LucideProps`
- **Usage**: Used by AgentsSection, HowItWorksSection, and generate page

---

## Composition Pattern

```tsx
// Standard page composition
<main>
  <HeroSection />
  <MetricsSection />
  <FeaturesSection />
  <HowItWorksSection />
  <AgentsSection />
  <CTASection />
</main>
```

All sections follow these conventions:
- Max width: `max-w-7xl` with responsive padding
- Vertical spacing: `py-24 md:py-32`
- Section headers: Badge + heading + subtext pattern
- Responsive: Mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints

---

*Last updated: 2025-01-01*
