"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Replace with actual auth when NextAuth is configured
      if (email && password) {
        // Simulate login for demo
        router.push("/dashboard");
      }
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <span className="text-2xl font-bold">
              Vibe<span className="text-primary-light">Prompt</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-text-secondary">
            Log in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary-light focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary-light focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary-light hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
