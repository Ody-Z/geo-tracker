"use client";

export function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="h-11 rounded-lg px-8 text-sm font-medium bg-background text-foreground hover:bg-background/90 transition-colors cursor-pointer"
    >
      Check if AI knows you
    </button>
  );
}
