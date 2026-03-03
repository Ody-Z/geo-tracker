"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          AIknowsMe
        </Link>

        <nav className="flex items-center gap-6">
          <a
            href="/#solution"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="/#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </a>
          <a
            href="/#waitlist"
            className={buttonVariants({ size: "sm" })}
          >
            Join Waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}
