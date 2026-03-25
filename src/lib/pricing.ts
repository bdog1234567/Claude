import { PricingTier } from "@/types";

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: 0,
    interval: "month",
    stripePriceId: "",
    features: [
      "5 prompt generations per day",
      "Text prompt output only",
      "Basic brainstorm chat",
      "2 image models supported",
    ],
  },
  {
    name: "Basic",
    price: 12,
    interval: "month",
    stripePriceId: process.env.STRIPE_PRICE_ID_BASIC || "",
    popular: true,
    features: [
      "50 prompt generations per day",
      "All output formats (Text, JSON, Midjourney)",
      "Advanced brainstorm chat",
      "All image models supported",
      "Image reference upload",
      "Prompt history",
    ],
  },
  {
    name: "Pro",
    price: 29,
    interval: "month",
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO || "",
    features: [
      "Unlimited prompt generations",
      "All output formats (Text, JSON, Midjourney)",
      "Priority AI with longer context",
      "All image & video models",
      "Image reference upload",
      "Prompt history & collections",
      "API access",
      "Priority support",
    ],
  },
];
