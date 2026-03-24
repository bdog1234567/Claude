import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptHub - AI Prompt Engineering for Creators",
  description:
    "The ultimate hub for AI content creators. Generate perfect prompts for Midjourney, DALL-E, Stable Diffusion, Runway, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
