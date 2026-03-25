import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { pricingTiers } from "@/lib/pricing";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-center text-4xl font-bold sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mb-12 text-center text-lg text-text-secondary">
            Start free. Upgrade as your creative needs grow.
          </p>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-8 ${
                  tier.popular
                    ? "border-primary bg-surface glow scale-105"
                    : "border-border bg-surface"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h2 className="mb-2 text-2xl font-bold">{tier.name}</h2>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  {tier.price > 0 && (
                    <span className="text-text-secondary">/month</span>
                  )}
                </div>
                <ul className="mb-8 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-text-secondary"
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
                  className={`block w-full rounded-lg py-3 text-center font-medium transition-colors ${
                    tier.popular
                      ? "bg-primary text-white hover:bg-primary-light"
                      : "border border-border bg-surface-light text-text-primary hover:bg-surface-lighter"
                  }`}
                >
                  {tier.price === 0 ? "Get Started Free" : `Subscribe - $${tier.price}/mo`}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mx-auto mt-20 max-w-2xl">
            <h2 className="mb-8 text-center text-2xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I change plans at any time?",
                  a: "Yes! You can upgrade or downgrade your plan anytime. Changes take effect immediately, and we'll prorate the difference.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, debit cards, and select digital wallets through our secure Stripe payment processing.",
                },
                {
                  q: "Is there a free trial for paid plans?",
                  a: "The Free plan lets you try core features indefinitely. When you're ready for more, paid plans start immediately with no trial needed.",
                },
                {
                  q: "What counts as a prompt generation?",
                  a: "Each time you generate output prompts (text, JSON, and Midjourney formats) from an idea, that counts as one generation. Chat messages for brainstorming don't count.",
                },
              ].map((faq) => (
                <div key={faq.q} className="rounded-xl border border-border bg-surface p-6">
                  <h3 className="mb-2 font-semibold">{faq.q}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
