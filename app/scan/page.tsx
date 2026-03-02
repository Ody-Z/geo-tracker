import { ScanForm } from "@/components/scan/ScanForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your AI Visibility | AIknowsMe",
  description:
    "Find out how ChatGPT, Claude, Gemini, and Perplexity represent you.",
};

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <ScanForm />
    </div>
  );
}
