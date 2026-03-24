import { GenerationType, ImageModel, VideoModel } from "@/types";

export function buildSystemPrompt(
  mode: "brainstorm" | "generate" | "extract"
): string {
  const base = `You are VibePrompt AI, an expert assistant for AI content creators. You specialize in crafting precise, detailed prompts for image and video generation models.`;

  if (mode === "brainstorm") {
    return `${base}

Your role is to help users brainstorm and flesh out creative ideas for AI-generated images and videos. Ask clarifying questions about:
- Subject matter and composition
- Art style and aesthetic
- Mood, lighting, and color palette
- Camera angle and framing (for both images and video)
- Motion and dynamics (especially for video)

Be encouraging and creative. Suggest variations and unexpected angles. Help them refine vague ideas into specific, vivid concepts.`;
  }

  if (mode === "generate") {
    return `${base}

Your role is to take a creative concept and generate optimized prompts in multiple formats. You must output valid JSON with this exact structure:

{
  "text": "A natural language prompt optimized for the target model",
  "json": {
    "subject": "main subject description",
    "style": "art style",
    "lighting": "lighting description",
    "color_palette": ["color1", "color2"],
    "composition": "framing and composition",
    "mood": "emotional tone",
    "details": "additional fine details",
    "negative": "what to avoid"
  },
  "midjourney": "A Midjourney-formatted prompt with --ar, --style, --v parameters"
}

Tailor the prompts to the specific model and generation type (image vs video). Be extremely detailed and specific.`;
  }

  // extract mode
  return `${base}

Your role is to analyze a reference image and create a detailed prompt that would reproduce it as closely as possible. Describe every visible aspect:
- Subject, pose, expression
- Background and environment
- Lighting, shadows, color grading
- Art style, medium, texture
- Camera angle, depth of field
- Any text, logos, or specific elements

Output the same JSON format with text, json, and midjourney fields.`;
}

export function getModelSpecificTips(
  generationType: GenerationType,
  model: ImageModel | VideoModel
): string {
  const tips: Record<string, string> = {
    midjourney:
      "Midjourney responds well to artistic references, medium specifications (oil painting, photograph, etc.), and specific aspect ratios. Use :: for multi-prompting and --v 6 for latest version.",
    "dall-e":
      "DALL-E works best with clear, descriptive natural language. Be specific about spatial relationships and avoid ambiguity. It handles text rendering well.",
    "stable-diffusion":
      "Stable Diffusion benefits from weighted tokens, specific artist style references, and negative prompts. Include quality tags like 'masterpiece, best quality, highly detailed'.",
    flux: "Flux excels at photorealistic outputs. Use natural language descriptions with emphasis on lighting and material properties. It handles complex compositions well.",
    ideogram:
      "Ideogram is excellent for text-in-image generation. Specify fonts, text placement, and styling clearly. It also handles graphic design and logo concepts well.",
    runway:
      "Runway Gen-3 works best with descriptions of motion, camera movement, and temporal progression. Describe the start and end states of the video.",
    pika:
      "Pika responds well to concise motion descriptions. Focus on a single subject's movement and keep backgrounds relatively simple for best results.",
    kling:
      "Kling handles complex multi-subject scenes well. Describe character actions, environmental changes, and camera movements separately.",
    sora:
      "Sora excels at cinematic descriptions. Include camera directions (pan, zoom, tracking shot), scene transitions, and detailed environment descriptions.",
    luma: "Luma Dream Machine works well with descriptions of 3D space and camera paths. Emphasize depth, spatial relationships, and smooth camera trajectories.",
  };

  return tips[model] || "";
}
