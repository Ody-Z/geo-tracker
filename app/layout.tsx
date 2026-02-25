import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEO Tracker — AI Visibility Dashboard",
  description:
    "Track how your brand appears in AI-generated responses from ChatGPT, Claude, Perplexity, and Gemini. Free scan available.",
  openGraph: {
    title: "GEO Tracker — AI Visibility Dashboard",
    description:
      "Track how your brand appears in AI-generated responses from ChatGPT, Claude, Perplexity, and Gemini.",
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
