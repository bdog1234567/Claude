"use client";

import Link from "next/link";

export default function DashboardNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-white">V</span>
            </div>
            <span className="text-xl font-bold text-text-primary">
              Vibe<span className="text-primary-light">Prompt</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary-light">
              Free Plan
            </span>
            <Link
              href="/pricing"
              className="text-sm text-accent transition-colors hover:text-accent/80"
            >
              Upgrade
            </Link>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-light text-text-secondary transition-colors hover:text-text-primary">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
