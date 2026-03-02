import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="font-bold tracking-tight">
            AIknowsMe
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AIknowsMe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
