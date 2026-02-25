"use client";

import { useEffect, useState } from "react";

interface VisibilityScoreGaugeProps {
  score: number;
  size?: number;
}

export function VisibilityScoreGauge({
  score,
  size = 180,
}: VisibilityScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degrees
  const offset = arcLength - (arcLength * animatedScore) / 100;

  const color =
    score >= 61
      ? "var(--color-score-high)"
      : score >= 31
        ? "var(--color-score-mid)"
        : "var(--color-score-low)";

  const label =
    score >= 61 ? "Good" : score >= 31 ? "Moderate" : "Low";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="-rotate-[135deg]"
      >
        {/* Background arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Score arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>
          {animatedScore}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
