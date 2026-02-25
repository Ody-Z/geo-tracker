"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AI_MODELS, MODEL_KEYS } from "@/lib/ai/models";

interface ScanDataPoint {
  date: string;
  overall: number;
  openai?: number;
  anthropic?: number;
  perplexity?: number;
  gemini?: number;
}

interface TrendChartProps {
  data: ScanDataPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  if (data.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border bg-muted/30 text-sm text-muted-foreground">
        Need at least 2 scans to show trends
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
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
          <Line
            type="monotone"
            dataKey="overall"
            name="Overall"
            stroke="var(--color-foreground)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          {MODEL_KEYS.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={AI_MODELS[key].name}
              stroke={AI_MODELS[key].color}
              strokeWidth={1.5}
              dot={{ r: 3 }}
              strokeDasharray="4 4"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
