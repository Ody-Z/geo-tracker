import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";

export function ShareCTA() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">
            Want to check your own AI visibility?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            See how AI models like ChatGPT, Claude, Perplexity, and Gemini talk about your brand. Free instant scan.
          </p>
        </div>
        <Link href="/">
          <Button className="gap-2 shrink-0">
            Check My Name
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
