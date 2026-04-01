// ─── MattDESIGN.AI v3 — Global Types ────────────────────────────────────────

// ─── Brief ───────────────────────────────────────────────────────────────────

export interface ProjectBrief {
  projectName: string;
  description: string;
  sector?: string;
  audience?: string;
  style?: string;
  tone?: "professional" | "playful" | "bold" | "minimal" | "luxury";
  goals?: string[];
  competitors?: string[];
  constraints?: string;
  lang?: "fr" | "en";
}

// ─── Brand DNA ───────────────────────────────────────────────────────────────

export interface BrandDNA {
  name: string;
  tagline: string;
  personality: string[];
  tone: string;
  palette: ColorPalette;
  typography: Typography;
  mood: string;
  visualStyle: string;
  rules: string[];
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}

export interface Typography {
  heading: string;
  body: string;
  mono?: string;
  scale: { [key: string]: string };
}

// ─── Strategy ────────────────────────────────────────────────────────────────

export interface Strategy {
  angle: string;
  messageStructure: string[];
  conversionGoals: string[];
  painPoints: string[];
  benefits: string[];
  differentiators: string[];
  userJourney: JourneyStep[];
}

export interface JourneyStep {
  stage: string;
  action: string;
  emotion: string;
}

// ─── Site Structure ───────────────────────────────────────────────────────────

export interface SiteStructure {
  pages: SitePage[];
  navigation: NavItem[];
  sections: SiteSection[];
  components: string[];
}

export interface SitePage {
  slug: string;
  title: string;
  sections: string[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SiteSection {
  id: string;
  type: SectionType;
  purpose: string;
  content?: SectionContent;
  cta?: CTA;
  order: number;
}

export type SectionType =
  | "hero"
  | "features"
  | "benefits"
  | "how-it-works"
  | "social-proof"
  | "pricing"
  | "faq"
  | "cta"
  | "footer"
  | "agents"
  | "comparison"
  | "demo"
  | "team"
  | "about";

export interface SectionContent {
  headline?: string;
  subheadline?: string;
  body?: string;
  items?: ContentItem[];
}

export interface ContentItem {
  title: string;
  description: string;
  icon?: string;
  badge?: string;
}

export interface CTA {
  primary: string;
  secondary?: string;
  primaryHref?: string;
  secondaryHref?: string;
}

// ─── Assets ──────────────────────────────────────────────────────────────────

export interface AssetSpec {
  id: string;
  name: string;
  role: string;
  format: string;
  priority: "critical" | "high" | "medium" | "low";
  prompt?: string;
  dimensions?: string;
  variants?: string[];
}

export interface ImagePrompt {
  id: string;
  name: string;
  prompt: string;
  negativePrompt?: string;
  style: string;
  model?: string;
  dimensions: string;
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

export interface SiteCopy {
  meta: MetaCopy;
  hero: HeroCopy;
  sections: { [sectionId: string]: SectionCopy };
  footer: FooterCopy;
  microcopy: { [key: string]: string };
}

export interface MetaCopy {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface HeroCopy {
  headline: string;
  subheadline: string;
  cta: CTA;
  proof?: string;
}

export interface SectionCopy {
  headline: string;
  subheadline?: string;
  body?: string;
  items?: { title: string; description: string }[];
  cta?: CTA;
  faq?: FAQItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FooterCopy {
  tagline: string;
  links: { [group: string]: NavItem[] };
  legal: string;
}

// ─── Stack ───────────────────────────────────────────────────────────────────

export interface TechStack {
  design: StackTool[];
  ai: StackTool[];
  build: StackTool[];
  storage: StackTool[];
  deploy: StackTool[];
}

export interface StackTool {
  name: string;
  purpose: string;
  cost: "free" | "freemium" | "open-source" | "paid";
  url?: string;
}

// ─── Agents ───────────────────────────────────────────────────────────────────

export type AgentId =
  | "director"
  | "strategist"
  | "brand-designer"
  | "ui-designer"
  | "asset-generator"
  | "copywriter"
  | "builder"
  | "qa-reviewer"
  | "critic"
  | "optimizer";

export interface AgentResult<T = unknown> {
  agentId: AgentId;
  success: boolean;
  data: T;
  score?: number;
  issues?: string[];
  suggestions?: string[];
  executionMs?: number;
}

export interface AgentConfig {
  id: AgentId;
  name: string;
  description: string;
  icon: string;
  color: string;
  role: string;
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export interface PipelineState {
  id: string;
  brief: ProjectBrief;
  status: PipelineStatus;
  currentAgent?: AgentId;
  completedAgents: AgentId[];
  results: Partial<PipelineResults>;
  critique?: CritiqueResult;
  improvement?: ImprovementResult;
  startedAt: string;
  completedAt?: string;
  iteration: number;
}

export type PipelineStatus =
  | "pending"
  | "running"
  | "critiquing"
  | "optimizing"
  | "complete"
  | "error";

export interface PipelineResults {
  direction: DirectionResult;
  strategy: Strategy;
  brand: BrandDNA;
  structure: SiteStructure;
  assets: AssetSpec[];
  prompts: ImagePrompt[];
  copy: SiteCopy;
  stack: TechStack;
  executionPlan: ExecutionStep[];
}

export interface DirectionResult {
  objective: string;
  audience: string;
  positioning: string;
  promise: string;
  creativeAngle: string;
  assumptions: string[];
}

export interface ExecutionStep {
  phase: number;
  name: string;
  tasks: string[];
  tools: string[];
  estimatedTime: string;
}

// ─── Critique & Optimization ──────────────────────────────────────────────────

export interface CritiqueResult {
  overallScore: number;
  dimensions: CritiqueDimension[];
  blockers: string[];
  warnings: string[];
  passed: string[];
}

export interface CritiqueDimension {
  name: string;
  score: number;
  issues: string[];
  suggestions: string[];
}

export interface ImprovementResult {
  applied: string[];
  summary: string;
  scoreGain: number;
}

// ─── Memory ───────────────────────────────────────────────────────────────────

export interface MemoryEntry {
  id: string;
  type: "pattern" | "result" | "feedback" | "template";
  sector?: string;
  tone?: string;
  score: number;
  data: unknown;
  tags: string[];
  createdAt: string;
  usedCount: number;
}

export interface MemoryStore {
  entries: MemoryEntry[];
  patterns: SuccessPattern[];
  lastUpdated: string;
}

export interface SuccessPattern {
  id: string;
  description: string;
  conditions: Partial<ProjectBrief>;
  template: Partial<PipelineResults>;
  avgScore: number;
  usageCount: number;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface GeneratePageState {
  step: "brief" | "generating" | "results";
  brief: Partial<ProjectBrief>;
  pipeline?: PipelineState;
  activeTab?: string;
}
