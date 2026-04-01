import type { ProjectBrief } from "@/types";

// ─── MattDESIGN.AI v3 — Agent Prompt Templates ───────────────────────────────

// ─── Director ─────────────────────────────────────────────────────────────────

export function directorPrompt(brief: ProjectBrief): string {
  return `You are the Director agent in MattDESIGN.AI.

Brief:
${JSON.stringify(brief, null, 2)}

Your task: Analyze the brief and return a JSON object with:
- objective: clear business objective (1 sentence)
- audience: specific target audience description
- positioning: market positioning statement
- promise: the core value promise to the customer
- creativeAngle: the unique creative direction for this project
- assumptions: list of reasonable assumptions made where brief was incomplete

Be specific, senior-level, and avoid generic language.
Return valid JSON only.`;
}

// ─── Strategist ───────────────────────────────────────────────────────────────

export function strategistPrompt(brief: ProjectBrief, direction: string): string {
  return `You are the Strategist agent in MattDESIGN.AI.

Brief:
${JSON.stringify(brief, null, 2)}

Director analysis:
${direction}

Your task: Return a JSON strategy object with:
- angle: the strategic narrative angle
- messageStructure: ordered list of key messages
- conversionGoals: primary conversion actions
- painPoints: audience pain points to address
- benefits: core benefits to communicate
- differentiators: what makes this project stand out
- userJourney: array of {stage, action, emotion} journey steps

Be conversion-focused and specific. Return valid JSON only.`;
}

// ─── Brand Designer ───────────────────────────────────────────────────────────

export function brandDesignerPrompt(brief: ProjectBrief, direction: string): string {
  return `You are the Brand Designer agent in MattDESIGN.AI.

Brief:
${JSON.stringify(brief, null, 2)}

Direction:
${direction}

Your task: Create a complete Brand DNA object:
- name: project/brand name
- tagline: short powerful tagline (max 10 words)
- personality: array of 4-5 personality traits
- tone: tone of voice description
- palette: {primary, secondary, accent, background, surface, text, textMuted} hex colors
- typography: {heading, body, mono, scale}
- mood: visual mood description
- visualStyle: visual style description
- rules: array of brand usage rules

Design a cohesive, premium, modern identity. Return valid JSON only.`;
}

// ─── UI/UX Designer ───────────────────────────────────────────────────────────

export function uiDesignerPrompt(
  brief: ProjectBrief,
  brand: string,
  strategy: string,
): string {
  return `You are the UI/UX Designer agent in MattDESIGN.AI.

Brief:
${JSON.stringify(brief, null, 2)}

Brand DNA:
${brand}

Strategy:
${strategy}

Your task: Design the site structure as JSON:
- pages: [{slug, title, sections[]}]
- navigation: [{label, href, children?}]
- sections: [{id, type, purpose, order, cta?}]
  Types: hero | features | benefits | how-it-works | social-proof | pricing | faq | cta | footer
- components: list of reusable components needed

Focus on conversion, hierarchy and mobile-first. Return valid JSON only.`;
}

// ─── Asset Generator ──────────────────────────────────────────────────────────

export function assetGeneratorPrompt(brief: ProjectBrief, brand: string): string {
  return `You are the Asset Generator agent in MattDESIGN.AI.

Brief:
${JSON.stringify(brief, null, 2)}

Brand DNA:
${brand}

Your task: Return two arrays as JSON:
1. assets: [{id, name, role, format, priority, dimensions, variants?}]
   Priorities: critical | high | medium | low
   Include: logo, favicon, hero image, og image, icons, illustrations

2. prompts: [{id, name, prompt, negativePrompt, style, model, dimensions}]
   Write production-ready Stable Diffusion / Midjourney prompts.
   Make them specific, stylistically coherent with the brand.

Return valid JSON only: {"assets": [...], "prompts": [...]}`;
}

// ─── Copywriter ───────────────────────────────────────────────────────────────

export function copywriterPrompt(
  brief: ProjectBrief,
  brand: string,
  strategy: string,
  sections: string,
): string {
  return `You are the Copywriter agent in MattDESIGN.AI.

Brief:
${JSON.stringify(brief, null, 2)}

Brand DNA:
${brand}

Strategy:
${strategy}

Site sections:
${sections}

Your task: Write the full site copy as JSON:
- meta: {title, description, ogTitle, ogDescription}
- hero: {headline, subheadline, cta: {primary, secondary, primaryHref, secondaryHref}, proof}
- sections: {[sectionId]: {headline, subheadline, body, items?, cta?, faq?}}
  For 'features' and 'benefits': items = [{title, description}]
  For 'faq': faq = [{question, answer}]
- footer: {tagline, links: {[group]: [{label, href}]}, legal}
- microcopy: {[key]: value} — form labels, tooltips, error messages, loading states

Write clear, premium, conversion-focused copy. No filler. Return valid JSON only.`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function builderPrompt(brief: ProjectBrief, structure: string): string {
  return `You are the Builder agent in MattDESIGN.AI.

Brief:
${JSON.stringify(brief, null, 2)}

Site structure:
${structure}

Your task: Recommend the optimal tech stack as JSON:
- design: [{name, purpose, cost, url}]
- ai: [{name, purpose, cost, url}]
- build: [{name, purpose, cost, url}]
- storage: [{name, purpose, cost, url}]
- deploy: [{name, purpose, cost, url}]

Cost options: free | open-source | freemium | paid
Prioritize free > open-source > freemium > paid.

Also return:
- executionPlan: [{phase, name, tasks[], tools[], estimatedTime}]

Return valid JSON only.`;
}

// ─── QA Reviewer ─────────────────────────────────────────────────────────────

export function qaReviewerPrompt(fullOutput: string): string {
  return `You are the QA Reviewer agent in MattDESIGN.AI.

Full project output:
${fullOutput}

Your task: Review and return a QA report as JSON:
- overallScore: 0-100
- dimensions: [{name, score, issues[], suggestions[]}]
  Dimensions: "Visual Quality", "Brand Consistency", "Copy Quality", "UX Structure", "Mobile Readiness", "Conversion Strength"
- blockers: critical issues that must be fixed
- warnings: non-blocking issues to address
- passed: things done well

Be a tough reviewer. Flag anything generic, weak, or incoherent. Return valid JSON only.`;
}

// ─── Critic ───────────────────────────────────────────────────────────────────

export function criticPrompt(output: string, previousScore?: number): string {
  return `You are the Critic — an elite quality evaluator in MattDESIGN.AI.
${previousScore !== undefined ? `Previous iteration score: ${previousScore}/100. You must be stricter.` : ""}

Output to evaluate:
${output}

Evaluate ruthlessly across these dimensions:
1. Strategic clarity (0-100)
2. Brand strength (0-100)
3. Copy quality (0-100)
4. UX & architecture (0-100)
5. Asset completeness (0-100)
6. Conversion potential (0-100)

Return JSON:
- overallScore: weighted average
- dimensions: [{name, score, issues[], suggestions[]}]
- blockers: critical failures
- warnings: improvements needed
- passed: strengths

Return valid JSON only.`;
}

// ─── Optimizer ────────────────────────────────────────────────────────────────

export function optimizerPrompt(output: string, critique: string): string {
  return `You are the Optimizer in MattDESIGN.AI.

Current output:
${output}

Critique:
${critique}

Your task:
1. Fix all blockers
2. Address all warnings
3. Improve weak dimensions
4. Preserve what scored well

Return JSON:
- applied: list of improvements applied
- summary: short summary of what changed
- scoreGain: estimated score improvement (0-20)
- improvements: the specific text/data changes made

Return valid JSON only.`;
}

// ─── Image Prompts ────────────────────────────────────────────────────────────

export const IMAGE_PROMPT_TEMPLATES = {
  hero: (brand: string, style: string) =>
    `Professional hero image for ${brand}. ${style}. Cinematic lighting, depth of field, ultra-detailed, 8K, photorealistic, dark background, high contrast, modern tech aesthetic, --ar 16:9 --q 2`,

  logo: (brand: string, palette: string) =>
    `Minimalist vector logo for "${brand}". Clean geometry, ${palette} color palette, white background, scalable, professional, modern, SVG style, no text, icon only`,

  illustration: (concept: string, style: string) =>
    `Abstract digital illustration of ${concept}. ${style}. Dark mode, neon accents, isometric perspective, clean lines, premium quality, 4K`,

  background: (mood: string) =>
    `Abstract dark background texture. ${mood}. Subtle gradient, noise texture, dark navy and deep blue tones, minimalist, premium, seamless tile`,

  mockup: (device: string, screen: string) =>
    `Professional ${device} mockup showing ${screen}. Dark environment, soft studio lighting, ultra-realistic, premium presentation style, 8K render`,
};
