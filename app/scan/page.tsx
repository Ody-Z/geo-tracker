import { ScanForm } from "@/components/scan/ScanForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Visibility Scan — GEO Tracker",
  description:
    "Check how ChatGPT, Claude, Perplexity, and Gemini talk about your brand. Free, no signup required.",
};

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <ScanForm />
    </div>
  );
}
