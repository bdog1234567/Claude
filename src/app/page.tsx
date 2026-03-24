import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { pricingTiers } from "@/lib/pricing";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Perfect Prompts for{" "}
              <span className="gradient-text">Every AI Model</span>
            </h1>
            <p className="mb-8 text-lg text-text-secondary sm:text-xl">
              The ultimate hub for AI content creators. Brainstorm ideas, generate
              optimized prompts, and create stunning images and videos with
              Midjourney, DALL-E, Stable Diffusion, Runway, and more.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="glow rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-white transition-all hover:bg-primary-light"
              >
                Start Creating Free
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border px-8 py-3.5 text-lg font-semibold text-text-primary transition-colors hover:bg-surface-light"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            Everything You Need to Create
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI Brainstorm Chat",
                description:
                  "Don't know where to start? Chat with our AI to develop and refine your creative vision from a vague idea into a concrete concept.",
                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
              },
              {
                title: "Multi-Format Prompts",
                description:
                  "Get your prompt in plain text, structured JSON, and Midjourney format. Each optimized for its use case.",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
              {
                title: "Model-Specific Tuning",
                description:
                  "Prompts tailored for Midjourney, DALL-E, Stable Diffusion, Flux, Runway, Pika, Kling, Sora, and more.",
                icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
              },
              {
                title: "Image Reference Analysis",
                description:
                  "Upload a reference image and get an exact prompt that recreates it. Perfect for replicating styles and compositions.",
                icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
              },
              {
                title: "Image & Video Support",
                description:
                  "Whether you're generating still images or dynamic video content, we optimize prompts for both mediums.",
                icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
              },
              {
                title: "Prompt History",
                description:
                  "Save and organize your best prompts into collections. Never lose a great prompt again.",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <svg
                    className="h-5 w-5 text-primary-light"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mb-12 text-center text-text-secondary">
            Start free, upgrade when you need more power.
          </p>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border p-6 ${
                  tier.popular
                    ? "border-primary bg-surface glow"
                    : "border-border bg-surface"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="mb-1 text-xl font-bold">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">
                    ${tier.price}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-text-secondary">/mo</span>
                  )}
                </div>
                <ul className="mb-6 space-y-2">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                    tier.popular
                      ? "bg-primary text-white hover:bg-primary-light"
                      : "border border-border bg-surface-light text-text-primary hover:bg-surface-lighter"
                  }`}
                >
                  {tier.price === 0 ? "Get Started" : "Subscribe"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="text-xs font-bold text-white">V</span>
              </div>
              <span className="text-sm font-semibold">VibePrompt</span>
            </div>
            <p className="text-sm text-text-secondary">
              &copy; 2026 VibePrompt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
