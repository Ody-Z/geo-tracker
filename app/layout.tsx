import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIknowsMe — Understand How AI Sees You",
  description:
    "Track how ChatGPT, Claude, Gemini, and Perplexity represent you — and what to fix next. For professionals, founders, and personal brands.",
  openGraph: {
    title: "AIknowsMe — Understand How AI Sees You",
    description:
      "Track how ChatGPT, Claude, Gemini, and Perplexity represent you — and what to fix next.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
