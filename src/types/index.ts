export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "basic" | "pro";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface PromptOutput {
  text: string;
  json: Record<string, unknown>;
  midjourney: string;
}

export type GenerationType = "image" | "video";

export type ImageModel =
  | "midjourney"
  | "dall-e"
  | "stable-diffusion"
  | "flux"
  | "ideogram";

export type VideoModel =
  | "runway"
  | "pika"
  | "kling"
  | "sora"
  | "luma";

export interface PromptRequest {
  idea: string;
  generationType: GenerationType;
  model: ImageModel | VideoModel;
  style?: string;
  referenceImageBase64?: string;
}

export interface PricingTier {
  name: string;
  price: number;
  interval: "month";
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}
