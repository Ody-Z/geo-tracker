import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

export function scoreColor(score: number): string {
  if (score >= 61) return "var(--color-score-high)";
  if (score >= 31) return "var(--color-score-mid)";
  return "var(--color-score-low)";
}

export function scoreLabel(score: number): string {
  if (score >= 61) return "Good";
  if (score >= 31) return "Moderate";
  return "Low";
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
