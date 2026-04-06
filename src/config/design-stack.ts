import type { DesignStackTool, DecisionMode } from "@/types/design-pipeline";

// ─── MattDESIGN.AI — Authorized Design Stack ─────────────────────────────────
// Every tool listed here is local, open-source or free.
// No external API dependency. No tool may be added without flagging it.

export const DESIGN_STACK: DesignStackTool[] = [
  // ── Generation / Composition ──────────────────────────────────────────────
  {
    id: "comfyui",
    name: "ComfyUI",
    category: "generation",
    purpose: "Primary generation engine — node-based workflows for Stable Diffusion",
    cost: "open-source",
    triggerConditions: [
      "complex generation",
      "workflow-based generation",
      "batch generation",
      "any image generation task",
    ],
  },
  {
    id: "comfyui-manager",
    name: "ComfyUI-Manager",
    category: "generation",
    purpose: "Install and manage ComfyUI custom nodes",
    cost: "open-source",
    isComfyUIModule: true,
    triggerConditions: ["custom node installation", "node management"],
  },
  {
    id: "invokeai",
    name: "InvokeAI",
    category: "generation",
    purpose: "Alternative generation UI — simpler workflows, quick iterations",
    cost: "open-source",
    triggerConditions: [
      "quick generation",
      "simple image generation",
      "rapid prototyping",
    ],
  },

  // ── Style & Structure Control ─────────────────────────────────────────────
  {
    id: "ip-adapter",
    name: "IP-Adapter",
    category: "composition",
    purpose: "Transfer style, subject or mood from a reference image",
    cost: "open-source",
    isComfyUIModule: true,
    triggerConditions: [
      "reference image exists",
      "style transfer",
      "mood preservation",
      "subject consistency",
    ],
  },
  {
    id: "controlnet",
    name: "ControlNet",
    category: "controlnet",
    purpose: "Lock pose, framing, structure, edges or composition",
    cost: "open-source",
    isComfyUIModule: true,
    triggerConditions: [
      "structure must be respected",
      "pose locked",
      "framing locked",
      "edge preservation",
      "composition control",
    ],
  },
  {
    id: "controlnet-aux",
    name: "ControlNet Aux",
    category: "controlnet",
    purpose: "Generate hint images for ControlNet (canny, depth, openpose, etc.)",
    cost: "open-source",
    isComfyUIModule: true,
    triggerConditions: [
      "hint image needed",
      "canny extraction",
      "depth map",
      "openpose extraction",
    ],
  },

  // ── Detailing & Enhancement ───────────────────────────────────────────────
  {
    id: "impact-pack",
    name: "ComfyUI-Impact-Pack",
    category: "detailing",
    purpose: "Detailer, detector, pipe and upscale nodes for ComfyUI",
    cost: "open-source",
    isComfyUIModule: true,
    triggerConditions: [
      "detail enhancement",
      "face fix",
      "sharpness needed",
      "in-pipeline upscale",
    ],
  },

  // ── Segmentation / Masking ────────────────────────────────────────────────
  {
    id: "sam2",
    name: "SAM 2",
    category: "segmentation",
    purpose: "Precise object segmentation — clean masks, targeted edits",
    cost: "open-source",
    triggerConditions: [
      "precise segmentation",
      "clean mask needed",
      "targeted retouche",
      "object isolation",
    ],
  },
  {
    id: "grounded-sam2",
    name: "Grounded-SAM 2",
    category: "segmentation",
    purpose: "Detect, segment and track multiple objects or scenes",
    cost: "open-source",
    triggerConditions: [
      "multi-object segmentation",
      "scene tracking",
      "complex scene analysis",
    ],
  },
  {
    id: "rembg",
    name: "rembg",
    category: "segmentation",
    purpose: "Fast background removal",
    cost: "open-source",
    triggerConditions: [
      "background removal",
      "quick cutout",
      "transparent background",
    ],
  },

  // ── Vectorization ─────────────────────────────────────────────────────────
  {
    id: "potrace",
    name: "Potrace",
    category: "vectorization",
    purpose: "Convert bitmap to SVG or PDF vector",
    cost: "open-source",
    triggerConditions: [
      "bitmap to vector",
      "SVG needed",
      "logo vectorization",
      "icon vectorization",
    ],
  },
  {
    id: "inkscape",
    name: "Inkscape",
    category: "vectorization",
    purpose: "Clean, correct and finalise vector assets",
    cost: "open-source",
    triggerConditions: [
      "vector cleanup",
      "SVG editing",
      "vector finalization",
      "path correction",
    ],
  },

  // ── Asset Management ──────────────────────────────────────────────────────
  {
    id: "digikam",
    name: "digiKam",
    category: "asset-management",
    purpose: "Organize asset library — tags, labels, search, metadata",
    cost: "open-source",
    triggerConditions: [
      "asset organization",
      "tag management",
      "asset search",
      "metadata management",
      "library browsing",
    ],
  },
  {
    id: "photoprism",
    name: "PhotoPrism",
    category: "asset-management",
    purpose: "Self-hosted photo management with AI-powered search",
    cost: "open-source",
    triggerConditions: [
      "photo management",
      "AI search",
      "asset browsing",
    ],
  },

  // ── Photo Editing ─────────────────────────────────────────────────────────
  {
    id: "darktable",
    name: "darktable",
    category: "photo-editing",
    purpose: "Non-destructive RAW processing and colour management",
    cost: "open-source",
    triggerConditions: [
      "RAW processing",
      "colour management",
      "serious photo editing",
      "non-destructive editing",
    ],
  },

  // ── Retouche ──────────────────────────────────────────────────────────────
  {
    id: "krita-ai-diffusion",
    name: "Krita AI Diffusion",
    category: "retouche",
    purpose: "Precise retouche, inpaint, outpaint with brush-level control",
    cost: "open-source",
    triggerConditions: [
      "precise retouche",
      "inpaint",
      "outpaint",
      "local editing",
      "brush-level control",
    ],
  },

  // ── Upscaling ─────────────────────────────────────────────────────────────
  {
    id: "upscayl",
    name: "Upscayl",
    category: "upscaling",
    purpose: "Final upscale — always last step in the chain",
    cost: "open-source",
    triggerConditions: [
      "upscale needed",
      "resolution increase",
      "final enlargement",
    ],
  },

  // ── Conversion / Normalization ────────────────────────────────────────────
  {
    id: "imagemagick",
    name: "ImageMagick",
    category: "conversion",
    purpose: "Batch conversion, normalization, format export",
    cost: "open-source",
    triggerConditions: [
      "format conversion",
      "batch processing",
      "normalization",
      "image cleanup",
    ],
  },

  // ── 3D / Compositing ─────────────────────────────────────────────────────
  {
    id: "blender",
    name: "Blender",
    category: "3d-compositing",
    purpose: "3D rendering, advanced compositing, complex mockups",
    cost: "open-source",
    triggerConditions: [
      "3D rendering",
      "mockup",
      "advanced compositing",
      "product visualization",
    ],
  },
];

// ─── Stack lookup ────────────────────────────────────────────────────────────

export const DESIGN_STACK_MAP = Object.fromEntries(
  DESIGN_STACK.map((t) => [t.id, t]),
) as Record<DesignStackTool["id"], DesignStackTool>;

// ─── ComfyUI modules (installed via ComfyUI-Manager) ────────────────────────

export const COMFYUI_MODULES = DESIGN_STACK.filter((t) => t.isComfyUIModule);

// ─── Decision Modes ──────────────────────────────────────────────────────────

export const DECISION_MODES: DecisionMode[] = [
  {
    id: "fast-clean",
    label: "Fast & Clean",
    need: "Quick, clean result",
    primaryTools: ["rembg", "impact-pack", "upscayl"],
    description: "Prioritize rembg + Impact-Pack + Upscayl for rapid, clean output.",
  },
  {
    id: "style-faithful",
    label: "Style Faithful",
    need: "Output faithful to a reference style",
    primaryTools: ["ip-adapter", "comfyui"],
    description: "Prioritize IP-Adapter to impose style, subject or mood from reference.",
  },
  {
    id: "controlled-composition",
    label: "Controlled Composition",
    need: "Precise structure and composition",
    primaryTools: ["controlnet", "controlnet-aux", "comfyui"],
    description: "Prioritize ControlNet to lock pose, framing, structure and edges.",
  },
  {
    id: "vector-logo",
    label: "Vector / Logo",
    need: "Logo, pictogram or vector deliverable",
    primaryTools: ["comfyui", "potrace", "inkscape"],
    description: "Prioritize Potrace + Inkscape for bitmap-to-vector conversion.",
  },
  {
    id: "asset-library",
    label: "Asset Library",
    need: "Asset bank and search",
    primaryTools: ["digikam", "photoprism"],
    description: "Prioritize digiKam or PhotoPrism for browsing, tagging and searching.",
  },
  {
    id: "photo-serious",
    label: "Serious Photo Editing",
    need: "RAW processing or professional colour work",
    primaryTools: ["darktable"],
    description: "Prioritize darktable for non-destructive RAW editing and colour management.",
  },
  {
    id: "precise-retouche",
    label: "Precise Retouche",
    need: "Local inpaint, outpaint or brush-level editing",
    primaryTools: ["krita-ai-diffusion"],
    description: "Prioritize Krita AI Diffusion for precise, brush-level retouche.",
  },
  {
    id: "3d-mockup",
    label: "3D / Mockup",
    need: "Product visualization, 3D rendering or complex mockup",
    primaryTools: ["blender", "comfyui"],
    description: "Prioritize Blender for 3D rendering and advanced compositing.",
  },
];
