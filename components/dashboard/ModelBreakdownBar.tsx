"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AI_MODELS, MODEL_KEYS } from "@/lib/ai/models";
import { truncate } from "@/lib/utils";

interface QueryModelData {
  query: string;
  openai: number;
  anthropic: number;
  perplexity: number;
  gemini: number;
}

interface ModelBreakdownBarProps {
  data: QueryModelData[];
}

export function ModelBreakdownBar({ data }: ModelBreakdownBarProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border bg-muted/30 text-sm text-muted-foreground">
        No data available
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    query: truncate(d.query, 30),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="query"
            tick={{ fontSize: 11 }}
            stroke="var(--color-muted-foreground)"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            stroke="var(--color-muted-foreground)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
          {MODEL_KEYS.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              name={AI_MODELS[key].name}
              fill={AI_MODELS[key].color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
