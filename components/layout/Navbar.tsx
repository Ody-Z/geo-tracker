"use client";

import Link from "next/link";
import { Radar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Radar className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">GEO Tracker</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/scan"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Free Scan
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
