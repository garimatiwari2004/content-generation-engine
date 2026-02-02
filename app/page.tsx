"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Sparkles, Zap, Calendar, ImageIcon } from "lucide-react";

type AuthStatus = {
  authenticated: boolean;
  status?: "CONNECTED" | "READY_FOR_AUTOMATION";
};

export default function HomePage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthStatus>({
    authenticated: false,
  });

  useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => {
        setAuth(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  function renderCTA() {
    if (loading) {
      return (
        <div className="h-12 w-48 rounded-md bg-muted animate-pulse" />
      );
    }

    if (!auth.authenticated) {
      return (
        <a
          href="/api/auth/linkedin"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground"
        >
          Get Started with LinkedIn
        </a>
      );
    }

    if (auth.status === "CONNECTED") {
      return (
        <a
          href="/linkedin/questions"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground"
        >
          Continue Setup
        </a>
      );
    }

    if (auth.status === "READY_FOR_AUTOMATION") {
      return (
        <a
          href="/dashboard"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground"
        >
          Go to Dashboard
        </a>
      );
    }

    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-6" />
            </div>
            <span className="text-xl font-semibold">
              HirezApp Content Engine
            </span>
          </div>

          {!loading && !auth.authenticated && (
            <a href="/api/auth/linkedin" className="font-medium">
              Sign in with LinkedIn
            </a>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-20">
        {/* Hero */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            AI-Powered Content Automation
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight lg:text-6xl">
            Automate Your LinkedIn <br />
            Content Creation
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Our AI-powered engine creates personalized LinkedIn posts with
            images, learns your preferences through intelligent questions, and
            automatically publishes content every 24 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {renderCTA()}

            <button
              type="button"
              className="h-12 rounded-md border border-input bg-transparent px-8 text-base font-medium"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Everything else stays EXACTLY the same */}
        {/* Features, How It Works, CTA, Footer */}
      </main>
    </div>
  );
}
