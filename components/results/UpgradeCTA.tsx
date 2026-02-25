import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ArrowRight } from "lucide-react";

interface UpgradeCTAProps {
  brandName: string;
}

export function UpgradeCTA({ brandName }: UpgradeCTAProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">
            Track {brandName} weekly
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            See how your AI visibility changes over time with automated weekly
            scans, trend charts, and email alerts.
          </p>
        </div>
        <Link href="/auth/signup?redirect=/dashboard">
          <Button className="gap-2 shrink-0">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
