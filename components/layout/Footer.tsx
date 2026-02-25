import Link from "next/link";
import { Radar } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Radar className="h-5 w-5 text-primary" />
            <span className="font-semibold">GEO Tracker</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Track your brand&apos;s visibility across AI-generated responses.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/scan" className="hover:text-foreground transition-colors">
              Free Scan
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
