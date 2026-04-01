import type {
  ProjectBrief,
  DirectionResult,
  Strategy,
  BrandDNA,
  SiteStructure,
  AssetSpec,
  ImagePrompt,
  SiteCopy,
  TechStack,
  ExecutionStep,
  CritiqueResult,
  ImprovementResult,
  AgentResult,
} from "@/types";
import { uid, sleep } from "@/lib/utils";
import { MD_BRAND_PALETTE, MD_BRAND_TYPOGRAPHY, TONE_DESCRIPTORS } from "@/config/design-tokens";

// ─── MattDESIGN.AI v3 — Agent Implementations ────────────────────────────────
// Each agent is a pure async function that takes context and returns a typed result.
// In production, swap the mock generators for real LLM calls (Ollama / OpenAI / etc.)

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function withTiming<T>(
  fn: () => Promise<T>,
): Promise<{ data: T; ms: number }> {
  const start = Date.now();
  const data = await fn();
  return { data, ms: Date.now() - start };
}

function ok<T>(agentId: AgentResult["agentId"], data: T, ms?: number): AgentResult<T> {
  return { agentId, success: true, data, executionMs: ms };
}

// ─── Agent 1 — Director ───────────────────────────────────────────────────────

export async function runDirector(
  brief: ProjectBrief,
): Promise<AgentResult<DirectionResult>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(200);
    const assumptions: string[] = [];
    if (!brief.sector) assumptions.push("Sector inferred as technology / SaaS");
    if (!brief.audience) assumptions.push("Audience assumed: decision-makers & early adopters");
    if (!brief.style) assumptions.push("Style defaulted to modern, minimal-luxury");

    const result: DirectionResult = {
      objective: `Build a premium digital presence for ${brief.projectName} that converts ${brief.audience ?? "prospects"} into customers.`,
      audience: brief.audience ?? "B2B decision-makers, tech-savvy professionals aged 28-45",
      positioning: `${brief.projectName} is positioned as the premium, reliable choice in ${brief.sector ?? "its market"} — combining sophistication with actionable results.`,
      promise: `${brief.projectName} delivers ${brief.description} faster, cleaner and more credibly than any alternative.`,
      creativeAngle: selectCreativeAngle(brief),
      assumptions,
    };
    return result;
  });
  return ok("director", data, ms);
}

function selectCreativeAngle(brief: ProjectBrief): string {
  const angles: Record<string, string> = {
    luxury: "Exclusivity-first: every pixel signals premium quality and restraint.",
    minimal: "Clarity as design: white space and precision communicate confidence.",
    bold: "Bold statement: high contrast, strong type, unapologetic positioning.",
    playful: "Warm energy: friendly visuals and copy that feel human and approachable.",
    professional: "Trusted authority: structured, credible, evidence-backed.",
  };
  return angles[brief.tone ?? "professional"] ?? angles.professional;
}

// ─── Agent 2 — Strategist ─────────────────────────────────────────────────────

export async function runStrategist(
  brief: ProjectBrief,
  direction: DirectionResult,
): Promise<AgentResult<Strategy>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(200);
    const result: Strategy = {
      angle: direction.creativeAngle,
      messageStructure: [
        `Hook: address the core pain point immediately`,
        `Promise: state the transformation ${brief.projectName} enables`,
        `Proof: show evidence (metrics, testimonials, case studies)`,
        `Method: explain how it works (without overwhelming)`,
        `Action: clear, low-friction call to action`,
      ],
      conversionGoals: [
        "Sign up / request demo",
        "Read case study / proof section",
        "Subscribe to email list",
      ],
      painPoints: derivePainPoints(brief),
      benefits: deriveBenefits(brief),
      differentiators: [
        `${brief.projectName} is built for speed and quality simultaneously`,
        "No generic output — every result is tailored",
        "Free / freemium-first philosophy reduces friction",
        "Modular system adapts to any project or sector",
      ],
      userJourney: [
        { stage: "Awareness", action: "Lands on hero section", emotion: "Curious" },
        { stage: "Interest", action: "Reads features & benefits", emotion: "Engaged" },
        { stage: "Consideration", action: "Reviews social proof & pricing", emotion: "Evaluating" },
        { stage: "Intent", action: "Clicks primary CTA", emotion: "Ready" },
        { stage: "Action", action: "Completes sign-up / contact form", emotion: "Confident" },
      ],
    };
    return result;
  });
  return ok("strategist", data, ms);
}

function derivePainPoints(brief: ProjectBrief): string[] {
  const generic = [
    "Too much time spent on repetitive design and copy tasks",
    "Inconsistent quality across projects and deliverables",
    "High cost of hiring full design + dev teams",
    "Generic outputs that don't reflect brand identity",
  ];
  if (brief.goals?.length) {
    brief.goals.slice(0, 2).forEach((g) =>
      generic.unshift(`Struggle to: ${g.toLowerCase()}`),
    );
  }
  return generic.slice(0, 4);
}

function deriveBenefits(brief: ProjectBrief): string[] {
  return [
    `${brief.projectName} generates premium-quality results in minutes, not weeks`,
    "Consistent brand DNA across every deliverable",
    "Free and open-source stack — zero vendor lock-in",
    "Modular architecture: reuse components across unlimited projects",
    "Built-in critique and optimization loop — output improves automatically",
  ];
}

// ─── Agent 3 — Brand Designer ─────────────────────────────────────────────────

export async function runBrandDesigner(
  brief: ProjectBrief,
  direction: DirectionResult,
): Promise<AgentResult<BrandDNA>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(300);
    const palette = brief.tone === "luxury"
      ? { ...MD_BRAND_PALETTE, primary: "#C9A84C", secondary: "#1A1A2E", accent: "#E8D5B7" }
      : brief.tone === "playful"
      ? { ...MD_BRAND_PALETTE, primary: "#F59E0B", secondary: "#EC4899", accent: "#06D6A0" }
      : MD_BRAND_PALETTE;

    const result: BrandDNA = {
      name: brief.projectName,
      tagline: generateTagline(brief),
      personality: TONE_DESCRIPTORS[brief.tone ?? "professional"] ?? TONE_DESCRIPTORS.professional,
      tone: brief.tone ?? "professional",
      palette,
      typography: MD_BRAND_TYPOGRAPHY,
      mood: generateMood(brief),
      visualStyle: generateVisualStyle(brief),
      rules: [
        "Never use more than 3 colours in a single composition",
        "Maintain minimum 60% negative space in layouts",
        "Headings always in primary colour gradient or white",
        "CTAs always use the primary accent colour",
        "Icons must be from a single coherent icon family",
        "Typography scale must follow the defined 8pt grid",
      ],
    };
    return result;
  });
  return ok("brand-designer", data, ms);
}

function generateTagline(brief: ProjectBrief): string {
  const taglines: Record<string, string> = {
    professional: `${brief.projectName}. Where precision meets performance.`,
    luxury: `${brief.projectName}. Crafted for those who demand excellence.`,
    bold: `${brief.projectName}. Built different. Built to win.`,
    minimal: `${brief.projectName}. Less noise. More signal.`,
    playful: `${brief.projectName}. Design that actually makes you smile.`,
  };
  return taglines[brief.tone ?? "professional"] ?? taglines.professional;
}

function generateMood(brief: ProjectBrief): string {
  const moods: Record<string, string> = {
    professional: "Dark, structured, authoritative — like a Bloomberg terminal meets Figma",
    luxury: "Deep blacks, gold accents, editorial photography — Bottega Veneta meets Apple",
    bold: "High contrast, sharp edges, energetic — Spotify Loud meets Stripe",
    minimal: "Air and precision — Linear meets Vercel's aesthetic",
    playful: "Warm, rounded, colourful — Notion meets Framer",
  };
  return moods[brief.tone ?? "professional"] ?? moods.professional;
}

function generateVisualStyle(brief: ProjectBrief): string {
  const styles: Record<string, string> = {
    professional: "Dark UI, subtle gradients, sharp grid, minimal decoration",
    luxury: "Editorial layout, rich textures, full-bleed images, gold accents",
    bold: "High contrast, large type, geometric shapes, kinetic energy",
    minimal: "Maximum white space, hairline rules, monochrome with one accent",
    playful: "Rounded corners, illustrations, micro-animations, warm palette",
  };
  return styles[brief.tone ?? "professional"] ?? styles.professional;
}

// ─── Agent 4 — UI/UX Designer ─────────────────────────────────────────────────

export async function runUIDesigner(
  brief: ProjectBrief,
  brand: BrandDNA,
  strategy: Strategy,
): Promise<AgentResult<SiteStructure>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(250);
    const result: SiteStructure = {
      pages: [
        {
          slug: "/",
          title: "Home",
          sections: ["hero", "features", "how-it-works", "agents", "social-proof", "cta", "footer"],
        },
        {
          slug: "/generate",
          title: "Generate",
          sections: ["generator-form", "output-preview", "footer"],
        },
      ],
      navigation: [
        { label: "Features", href: "/#features" },
        { label: "How it works", href: "/#how-it-works" },
        { label: "Agents", href: "/#agents" },
        { label: "Generate", href: "/generate" },
      ],
      sections: [
        { id: "hero", type: "hero", purpose: "Hook visitor with bold headline + CTA", order: 1 },
        { id: "features", type: "features", purpose: "Show 6 key features with icons", order: 2 },
        { id: "how-it-works", type: "how-it-works", purpose: "3-step visual process", order: 3 },
        { id: "agents", type: "agents", purpose: "Showcase the 10 agent roles", order: 4 },
        { id: "social-proof", type: "social-proof", purpose: "Metrics + testimonials", order: 5 },
        { id: "cta", type: "cta", purpose: "Final strong call to action", order: 6 },
        { id: "footer", type: "footer", purpose: "Navigation + legal", order: 7 },
      ],
      components: [
        "Button", "Card", "Badge", "Input", "Textarea", "Progress",
        "AgentCard", "FeatureCard", "StepCard", "MetricCard",
        "Header", "Footer", "NavBar",
      ],
    };
    return result;
  });
  return ok("ui-designer", data, ms);
}

// ─── Agent 5 — Asset Generator ────────────────────────────────────────────────

export async function runAssetGenerator(
  brief: ProjectBrief,
  brand: BrandDNA,
): Promise<AgentResult<{ assets: AssetSpec[]; prompts: ImagePrompt[] }>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(200);
    const name = brief.projectName;
    const style = brand.visualStyle;

    const assets: AssetSpec[] = [
      { id: "logo-primary", name: "Logo Primary", role: "Main brand logo (dark bg)", format: "SVG + PNG", priority: "critical", dimensions: "200×60px", variants: ["white", "colour", "monochrome"] },
      { id: "favicon", name: "Favicon", role: "Browser tab icon", format: "ICO + PNG", priority: "critical", dimensions: "32×32, 64×64, 180×180px" },
      { id: "hero-image", name: "Hero Image", role: "Full-width hero background", format: "WebP", priority: "critical", dimensions: "1920×1080px", variants: ["mobile 390×844"] },
      { id: "og-image", name: "OG Social Image", role: "Social sharing preview", format: "PNG", priority: "high", dimensions: "1200×630px" },
      { id: "agent-icons", name: "Agent Icons", role: "Icon per agent (8 total)", format: "SVG", priority: "high", dimensions: "48×48px", variants: ["filled", "outline"] },
      { id: "feature-illustrations", name: "Feature Illustrations", role: "Abstract illustration per feature", format: "SVG / WebP", priority: "medium", dimensions: "400×300px" },
      { id: "mockup-laptop", name: "Laptop Mockup", role: "Product screenshot mockup", format: "PNG / WebP", priority: "medium", dimensions: "1200×800px" },
      { id: "texture-bg", name: "Background Texture", role: "Subtle noise texture overlay", format: "PNG", priority: "low", dimensions: "512×512px (tile)" },
    ];

    const prompts: ImagePrompt[] = [
      {
        id: "hero-prompt",
        name: "Hero Image",
        prompt: `Abstract dark tech landscape, floating UI components, electric blue and violet gradients, depth of field, cinematic, 8K, ultra-detailed, representing ${name}: ${brief.description}. ${style}. No text, no logos.`,
        negativePrompt: "text, watermark, logo, low quality, blurry, bright white background",
        style: "cinematic, dark, premium",
        model: "Stable Diffusion XL",
        dimensions: "1920×1080",
      },
      {
        id: "og-prompt",
        name: "OG Social Image",
        prompt: `Premium dark banner for ${name}. Abstract gradient from #3B82F6 to #7C3AED, geometric minimal composition, professional, social media ready. No text.`,
        negativePrompt: "text, watermark, busy, cluttered",
        style: "minimal, gradient, dark",
        model: "Stable Diffusion XL",
        dimensions: "1200×630",
      },
      {
        id: "feature-illustration",
        name: "Feature Illustration",
        prompt: `Isometric abstract illustration of AI-powered design workflow. Dark background, neon blue and violet accents, clean geometric shapes, premium quality, 4K render. No text.`,
        negativePrompt: "text, logo, realistic photo, bright white",
        style: "isometric, abstract, neon",
        model: "Stable Diffusion XL",
        dimensions: "800×600",
      },
    ];

    return { assets, prompts };
  });
  return ok("asset-generator", data, ms);
}

// ─── Agent 6 — Copywriter ─────────────────────────────────────────────────────

export async function runCopywriter(
  brief: ProjectBrief,
  brand: BrandDNA,
  strategy: Strategy,
): Promise<AgentResult<SiteCopy>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(300);
    const name = brief.projectName;

    const result: SiteCopy = {
      meta: {
        title: `${name} — ${brand.tagline.split(".")[1]?.trim() ?? "AI-Powered Design System"}`,
        description: `${name} transforms a brief into a complete, premium web project in minutes. Multi-agent AI system for design, copy and code.`,
        ogTitle: `${name} — Design faster. Launch smarter.`,
        ogDescription: `From brief to production-ready site. AI-powered, designer-quality, zero compromise.`,
      },
      hero: {
        headline: heroHeadline(brief, brand),
        subheadline: `From a one-line brief to a production-ready site — brand DNA, copy, assets and code — in minutes. No compromise on quality.`,
        cta: {
          primary: "Generate your site →",
          secondary: "See how it works",
          primaryHref: "/generate",
          secondaryHref: "/#how-it-works",
        },
        proof: "Used by 500+ designers & founders to ship premium projects 10× faster.",
      },
      sections: {
        features: {
          headline: "Everything a senior team would build. Automated.",
          subheadline: "8 specialised agents working in parallel — so you get studio-quality output without the studio cost.",
          items: [
            { title: "Brand DNA Engine", description: "Generates a complete visual identity: palette, typography, mood, rules — in seconds." },
            { title: "Multi-Agent Pipeline", description: "Director → Strategist → Designer → Copywriter → Builder → QA. Each agent does one thing perfectly." },
            { title: "Self-Improvement Loop", description: "The Critic scores the output. The Optimizer fixes weaknesses. Every iteration is better." },
            { title: "Production-Ready Code", description: "Clean Next.js + TypeScript + Tailwind output. Modular, scalable, deployable immediately." },
            { title: "Asset Prompts Library", description: "Every project gets Stable Diffusion prompts for hero, logo, OG image and illustrations." },
            { title: "Memory System", description: "Learns from every project. Reuses successful patterns. Improves automatically over time." },
          ],
        },
        "how-it-works": {
          headline: "Brief in. Premium site out.",
          subheadline: "Three steps. Zero compromise.",
          items: [
            { title: "1. Drop your brief", description: "Name, description, sector, tone, audience. Even one sentence is enough." },
            { title: "2. Agents get to work", description: "10 specialised agents run in sequence: strategy, brand, design, copy, assets, code, QA." },
            { title: "3. Download your project", description: "Receive a complete, structured project: design system, copy, code, prompts and docs." },
          ],
        },
        agents: {
          headline: "Not one AI. An entire team.",
          subheadline: "Each agent is an expert. Together, they outperform any single model.",
        },
        "social-proof": {
          headline: "The numbers speak.",
          items: [
            { title: "10×", description: "Faster than hiring a design team" },
            { title: "8", description: "Specialised agents per project" },
            { title: "100%", description: "Free & open-source stack by default" },
            { title: "∞", description: "Projects you can generate" },
          ],
        },
        cta: {
          headline: "Your next premium project starts here.",
          subheadline: "One brief. Full team. Zero compromise.",
          cta: {
            primary: "Start generating →",
            secondary: "Read the docs",
            primaryHref: "/generate",
            secondaryHref: "/docs",
          },
        },
        faq: {
          headline: "Common questions.",
          faq: [
            { question: "Is it really free?", answer: "Yes. The core system is open-source. We use free tiers of Vercel, Supabase and open-source AI models by default." },
            { question: "What does it actually output?", answer: "A full project folder: design system, structured copy, asset prompts, component code (Next.js + Tailwind), and an execution plan." },
            { question: "Do I need to know how to code?", answer: "No. The output is structured for no-code tools (Framer, Webflow) OR for developers who want clean code." },
            { question: "Can I use my own AI model?", answer: "Yes. The system is model-agnostic. Plug in Ollama, OpenAI, Anthropic — or run fully locally." },
          ],
        },
      },
      footer: {
        tagline: brand.tagline,
        links: {
          Product: [
            { label: "Features", href: "/#features" },
            { label: "How it works", href: "/#how-it-works" },
            { label: "Generate", href: "/generate" },
          ],
          Resources: [
            { label: "Documentation", href: "/docs" },
            { label: "GitHub", href: "https://github.com" },
          ],
          Legal: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
          ],
        },
        legal: `© ${new Date().getFullYear()} ${name}. Open-source. Built with ❤️`,
      },
      microcopy: {
        "form.projectName.label": "Project name",
        "form.projectName.placeholder": "e.g. Acme Studio",
        "form.description.label": "What does it do?",
        "form.description.placeholder": "Describe your project in one sentence…",
        "form.sector.label": "Sector",
        "form.tone.label": "Tone",
        "form.submit": "Generate →",
        "loading.director": "Director is analysing your brief…",
        "loading.strategist": "Strategist is defining the angle…",
        "loading.brand": "Brand Designer is crafting your identity…",
        "loading.ui": "UI Designer is structuring the site…",
        "loading.assets": "Asset Generator is preparing prompts…",
        "loading.copy": "Copywriter is writing your content…",
        "loading.builder": "Builder is selecting your stack…",
        "loading.qa": "QA Reviewer is checking quality…",
        "loading.critic": "Critic is scoring the output…",
        "loading.optimizer": "Optimizer is improving the result…",
        "error.required": "This field is required",
        "error.generic": "Something went wrong. Please try again.",
      },
    };
    return result;
  });
  return ok("copywriter", data, ms);
}

function heroHeadline(brief: ProjectBrief, brand: BrandDNA): string {
  const headlines: Record<string, string> = {
    professional: `${brief.projectName}.\nThe AI design system\nbuilt for results.`,
    luxury: `${brief.projectName}.\nWhere AI meets\ncraftsmanship.`,
    bold: `${brief.projectName}.\nDesign. Code. Ship.\nFaster than ever.`,
    minimal: `${brief.projectName}.\nLess effort.\nMore impact.`,
    playful: `${brief.projectName}.\nYour AI design team,\nalways ready.`,
  };
  return headlines[brief.tone ?? "professional"] ?? headlines.professional;
}

// ─── Agent 7 — Builder ────────────────────────────────────────────────────────

export async function runBuilder(
  brief: ProjectBrief,
): Promise<AgentResult<{ stack: TechStack; executionPlan: ExecutionStep[] }>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(200);
    const stack: TechStack = {
      design: [
        { name: "Penpot", purpose: "UI/UX design & prototyping", cost: "open-source", url: "https://penpot.app" },
        { name: "Figma", purpose: "Component design & collaboration", cost: "freemium", url: "https://figma.com" },
      ],
      ai: [
        { name: "Ollama", purpose: "Local LLM inference", cost: "open-source", url: "https://ollama.com" },
        { name: "Stable Diffusion XL", purpose: "Image generation", cost: "open-source" },
        { name: "ComfyUI", purpose: "Advanced image workflows", cost: "open-source", url: "https://github.com/comfyanonymous/ComfyUI" },
      ],
      build: [
        { name: "Next.js 15", purpose: "React framework", cost: "open-source", url: "https://nextjs.org" },
        { name: "TypeScript", purpose: "Type safety", cost: "open-source" },
        { name: "Tailwind CSS v4", purpose: "Utility-first styling", cost: "open-source", url: "https://tailwindcss.com" },
        { name: "shadcn/ui", purpose: "Accessible UI components", cost: "open-source", url: "https://ui.shadcn.com" },
        { name: "Framer Motion", purpose: "Animations", cost: "freemium", url: "https://framer.com/motion" },
      ],
      storage: [
        { name: "Supabase", purpose: "Database + auth + storage", cost: "freemium", url: "https://supabase.com" },
        { name: "Vercel KV", purpose: "Edge key-value store", cost: "freemium" },
      ],
      deploy: [
        { name: "Vercel", purpose: "Deployment & edge network", cost: "freemium", url: "https://vercel.com" },
        { name: "Cloudflare Pages", purpose: "Static deploy alternative", cost: "free", url: "https://pages.cloudflare.com" },
      ],
    };

    const executionPlan: ExecutionStep[] = [
      { phase: 1, name: "Brand DNA", tasks: ["Define palette", "Set typography", "Write brand rules"], tools: ["Penpot", "Figma"], estimatedTime: "1h" },
      { phase: 2, name: "Wireframe", tasks: ["Map sections", "Define grid", "Sketch layouts"], tools: ["Penpot", "Figma"], estimatedTime: "2h" },
      { phase: 3, name: "Assets", tasks: ["Generate images", "Export icons", "Prepare favicon"], tools: ["Stable Diffusion XL", "ComfyUI"], estimatedTime: "2h" },
      { phase: 4, name: "Copy", tasks: ["Write all sections", "Review CTA", "QA readability"], tools: ["Ollama"], estimatedTime: "1h" },
      { phase: 5, name: "Assembly", tasks: ["Implement components", "Build pages", "Connect data"], tools: ["Next.js", "Tailwind", "shadcn/ui"], estimatedTime: "4h" },
      { phase: 6, name: "QA", tasks: ["Test responsiveness", "Audit accessibility", "Performance check"], tools: ["Playwright", "Lighthouse"], estimatedTime: "1h" },
      { phase: 7, name: "Export & Deploy", tasks: ["Build production bundle", "Deploy to Vercel", "Set up domain"], tools: ["Vercel CLI"], estimatedTime: "30min" },
    ];

    return { stack, executionPlan };
  });
  return ok("builder", data, ms);
}

// ─── Agent 8 — QA Reviewer ────────────────────────────────────────────────────

export async function runQAReviewer(
  results: Partial<import("@/types").PipelineResults>,
): Promise<AgentResult<CritiqueResult>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(300);
    const result: CritiqueResult = {
      overallScore: 82,
      dimensions: [
        { name: "Visual Quality", score: 85, issues: [], suggestions: ["Add motion blur to hero image prompt"] },
        { name: "Brand Consistency", score: 90, issues: [], suggestions: [] },
        { name: "Copy Quality", score: 80, issues: ["FAQ section could have more industry-specific answers"], suggestions: ["Add 2 more sector-specific FAQs"] },
        { name: "UX Structure", score: 82, issues: [], suggestions: ["Consider adding a sticky CTA bar on mobile"] },
        { name: "Mobile Readiness", score: 78, issues: ["Hero headline may be too long on mobile"], suggestions: ["Add shorter mobile variant for hero headline"] },
        { name: "Conversion Strength", score: 80, issues: [], suggestions: ["Add social proof counter near hero CTA"] },
      ],
      blockers: [],
      warnings: [
        "Hero headline should have a mobile-optimised variant",
        "FAQ needs at least 2 more industry-specific questions",
      ],
      passed: [
        "Brand DNA is coherent and premium",
        "Tech stack is free/open-source first",
        "Copy is clear and conversion-oriented",
        "Section order follows proven conversion logic",
        "Asset prompts are specific and production-ready",
      ],
    };
    return result;
  });
  return ok("qa-reviewer", data, ms);
}

// ─── Agent 9 — Critic ─────────────────────────────────────────────────────────

export async function runCritic(
  results: Partial<import("@/types").PipelineResults>,
  previousScore?: number,
): Promise<AgentResult<CritiqueResult>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(200);
    const base = previousScore ?? 82;
    // Critic is tougher than QA
    const score = Math.max(base - 5, 60);
    const result: CritiqueResult = {
      overallScore: score,
      dimensions: [
        { name: "Strategic Clarity", score: score + 8, issues: [], suggestions: ["Add a one-sentence positioning statement above the fold"] },
        { name: "Brand Strength", score: score + 10, issues: [], suggestions: [] },
        { name: "Copy Quality", score: score + 2, issues: ["Some CTAs are slightly generic"], suggestions: ["Make CTAs more specific to the outcome"] },
        { name: "UX & Architecture", score: score + 5, issues: [], suggestions: ["Consider adding a comparison table"] },
        { name: "Asset Completeness", score: score - 2, issues: ["Missing email header template"], suggestions: ["Add email template to asset list"] },
        { name: "Conversion Potential", score: score + 3, issues: ["No urgency element present"], suggestions: ["Add limited-access or waitlist framing"] },
      ],
      blockers: score < 65 ? ["Output quality is below acceptable threshold"] : [],
      warnings: [
        "CTAs could be more outcome-specific",
        "Add urgency element to drive conversion",
        "Email template missing from asset list",
      ],
      passed: [
        "Structure follows proven conversion pattern",
        "Brand palette is premium and coherent",
        "Tech stack is properly prioritised (free-first)",
      ],
    };
    return result;
  });
  return ok("critic", data, ms);
}

// ─── Agent 10 — Optimizer ─────────────────────────────────────────────────────

export async function runOptimizer(
  results: Partial<import("@/types").PipelineResults>,
  critique: CritiqueResult,
): Promise<AgentResult<ImprovementResult>> {
  const { data, ms } = await withTiming(async () => {
    await sleep(200);
    const improvements: string[] = [];

    if (critique.warnings.some((w) => w.includes("CTA"))) {
      improvements.push("Updated CTAs to be outcome-specific (e.g. 'Start generating →' → 'Generate your site in 60s →')");
    }
    if (critique.warnings.some((w) => w.includes("urgency"))) {
      improvements.push("Added 'Early Access — Limited spots' framing to hero section");
    }
    if (critique.warnings.some((w) => w.includes("email"))) {
      improvements.push("Added email header template to asset list (1200×300px)");
    }
    if (critique.warnings.some((w) => w.includes("mobile"))) {
      improvements.push("Added mobile-specific hero headline variant (shorter, punchier)");
    }

    const result: ImprovementResult = {
      applied: improvements,
      summary: `Applied ${improvements.length} improvements targeting conversion, copy specificity and asset completeness.`,
      scoreGain: Math.min(improvements.length * 3, 12),
    };
    return result;
  });
  return ok("optimizer", data, ms);
}
