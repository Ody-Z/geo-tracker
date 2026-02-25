"use client";

import { Badge } from "@/components/ui/badge";
import { formatDateTime, scoreColor, scoreLabel } from "@/lib/utils";

interface ScanRow {
  id: string;
  status: string;
  overallScore: number | null;
  triggeredBy: string;
  createdAt: string;
  completedAt: string | null;
}

interface ScanHistoryTableProps {
  scans: ScanRow[];
}

export function ScanHistoryTable({ scans }: ScanHistoryTableProps) {
  if (scans.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border bg-muted/30 text-sm text-muted-foreground">
        No scan history yet
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Score</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Triggered by</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr key={scan.id} className="border-b last:border-0">
              <td className="px-4 py-3 text-muted-foreground">
                {formatDateTime(scan.createdAt)}
              </td>
              <td className="px-4 py-3">
                {scan.overallScore !== null ? (
                  <span
                    className="font-semibold"
                    style={{ color: scoreColor(scan.overallScore) }}
                  >
                    {scan.overallScore}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      ({scoreLabel(scan.overallScore)})
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    scan.status === "completed"
                      ? "success"
                      : scan.status === "failed"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-[10px]"
                >
                  {scan.status}
                </Badge>
              </td>
              <td className="px-4 py-3 capitalize text-muted-foreground">
                {scan.triggeredBy}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
