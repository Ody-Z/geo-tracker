"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ModelBreakdownBar } from "@/components/dashboard/ModelBreakdownBar";
import { ScanHistoryTable } from "@/components/dashboard/ScanHistoryTable";
import { QueryPerformanceGrid } from "@/components/dashboard/QueryPerformanceGrid";
import { VisibilityScoreGauge } from "@/components/results/VisibilityScoreGauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Play, Globe, Trash2 } from "lucide-react";
import { formatDate, scoreColor } from "@/lib/utils";
import { MODEL_KEYS, type ModelKey } from "@/lib/ai/models";

interface ScanResult {
  model: string;
  query: string;
  brandMentioned: boolean;
  visibilityScore: number;
  sentiment: string;
}

interface Scan {
  id: string;
  status: string;
  overallScore: number | null;
  triggeredBy: string;
  createdAt: string;
  completedAt: string | null;
  results: ScanResult[];
}

interface BrandData {
  id: string;
  name: string;
  domain: string | null;
  queries: { promptText: string }[];
  scans: Scan[];
}

export default function BrandDetailPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const router = useRouter();
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchBrand();
  }, [brandId]);

  async function fetchBrand() {
    try {
      const res = await fetch(`/api/brands/${brandId}`);
      if (res.ok) {
        setBrand(await res.json());
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  }

  async function handleRunScan() {
    setScanning(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/scans`, {
        method: "POST",
      });
      if (res.ok) {
        const { scanId } = await res.json();
        router.push(`/results/${scanId}`);
      }
    } catch {
      // error
    } finally {
      setScanning(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this brand and all its scan history?")) return;
    await fetch(`/api/brands/${brandId}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 text-center">
        <p className="text-muted-foreground">Brand not found</p>
      </div>
    );
  }

  const completedScans = brand.scans.filter(
    (s) => s.status === "completed" && s.overallScore !== null
  );
  const latestScan = completedScans[0];

  // Prepare trend chart data
  const trendData = completedScans
    .slice()
    .reverse()
    .map((scan) => {
      const point: Record<string, number | string> = {
        date: formatDate(scan.createdAt),
        overall: scan.overallScore || 0,
      };

      // Average score per model for this scan
      for (const key of MODEL_KEYS) {
        const modelResults = scan.results.filter((r) => r.model === key);
        if (modelResults.length > 0) {
          point[key] = Math.round(
            modelResults.reduce((s, r) => s + r.visibilityScore, 0) /
              modelResults.length
          );
        }
      }

      return point;
    });

  // Prepare model breakdown data (latest scan only)
  const queryBreakdown =
    latestScan?.results
      ? brand.queries.map((q) => {
          const row: Record<string, number | string> = { query: q.promptText };
          for (const key of MODEL_KEYS) {
            const result = latestScan.results.find(
              (r) => r.model === key && r.query === q.promptText
            );
            row[key] = result?.visibilityScore || 0;
          }
          return row;
        })
      : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{brand.name}</h1>
            {brand.domain && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Globe className="h-3 w-3" />
                {brand.domain}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRunScan}
            disabled={scanning}
            className="gap-2"
          >
            {scanning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run Scan
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Score overview */}
      {latestScan && (
        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          <Card className="flex items-center justify-center p-6">
            <VisibilityScoreGauge score={latestScan.overallScore || 0} />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Latest Scan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Scanned</span>
                <span>{formatDate(latestScan.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Scans</span>
                <span>{completedScans.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Queries</span>
                <span>{brand.queries.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Models mentioning brand</span>
                <span>
                  {
                    MODEL_KEYS.filter((key) =>
                      latestScan.results.some(
                        (r) => r.model === key && r.brandMentioned
                      )
                    ).length
                  }
                  /{MODEL_KEYS.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={trendData as any} />
        </CardContent>
      </Card>

      {/* Model breakdown */}
      {queryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Model Breakdown (Latest Scan)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ModelBreakdownBar data={queryBreakdown as any} />
          </CardContent>
        </Card>
      )}

      {/* Query × Model matrix */}
      {latestScan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Query Performance Grid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QueryPerformanceGrid
              results={latestScan.results}
              queries={brand.queries.map((q) => q.promptText)}
            />
          </CardContent>
        </Card>
      )}

      {/* Scan history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scan History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScanHistoryTable scans={brand.scans} />
        </CardContent>
      </Card>
    </div>
  );
}
