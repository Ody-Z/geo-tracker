"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatDate, scoreColor } from "@/lib/utils";

interface Scan {
  id: string;
  overallScore: number | null;
  createdAt: string;
  status: string;
}

interface BrandCardProps {
  id: string;
  name: string;
  domain: string | null;
  scans: Scan[];
}

export function BrandCard({ id, name, domain, scans }: BrandCardProps) {
  const completedScans = scans.filter((s) => s.status === "completed" && s.overallScore !== null);
  const latestScore = completedScans[0]?.overallScore ?? null;
  const prevScore = completedScans[1]?.overallScore ?? null;

  const scoreDelta = latestScore !== null && prevScore !== null ? latestScore - prevScore : null;

  return (
    <Link href={`/dashboard/${id}`}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{name}</CardTitle>
            {latestScore !== null && (
              <span
                className="text-2xl font-bold"
                style={{ color: scoreColor(latestScore) }}
              >
                {latestScore}
              </span>
            )}
          </div>
          {domain && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              {domain}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {/* Trend indicator */}
            {scoreDelta !== null ? (
              <div className="flex items-center gap-1 text-sm">
                {scoreDelta > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600">+{scoreDelta}</span>
                  </>
                ) : scoreDelta < 0 ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">{scoreDelta}</span>
                  </>
                ) : (
                  <>
                    <Minus className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">No change</span>
                  </>
                )}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">
                {completedScans.length === 0
                  ? "No scans yet"
                  : "First scan"}
              </span>
            )}

            <Badge variant="secondary" className="text-[10px]">
              {completedScans.length} scan{completedScans.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Mini sparkline placeholder */}
          {completedScans.length >= 2 && (
            <div className="mt-3 flex items-end gap-0.5 h-8">
              {completedScans
                .slice(0, 8)
                .reverse()
                .map((scan, i) => (
                  <div
                    key={scan.id}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${Math.max(10, ((scan.overallScore || 0) / 100) * 100)}%`,
                      backgroundColor: scoreColor(scan.overallScore || 0),
                      opacity: 0.3 + (i / 8) * 0.7,
                    }}
                  />
                ))}
            </div>
          )}

          {completedScans[0] && (
            <p className="mt-2 text-[10px] text-muted-foreground">
              Last scan: {formatDate(completedScans[0].createdAt)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
