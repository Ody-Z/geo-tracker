"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
  onCtaClick?: () => void;
  loading?: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  highlighted,
  badge,
  onCtaClick,
  loading,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        highlighted && "border-primary shadow-lg shadow-primary/10"
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="px-3 py-1">{badge}</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          {period && (
            <span className="text-muted-foreground">/{period}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-6">
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature.text} className="flex items-start gap-2 text-sm">
              {feature.included ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <X className="h-4 w-4 shrink-0 text-muted-foreground/40 mt-0.5" />
              )}
              <span
                className={cn(
                  !feature.included && "text-muted-foreground/60"
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        {onCtaClick ? (
          <Button
            onClick={onCtaClick}
            variant={highlighted ? "default" : "outline"}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : cta}
          </Button>
        ) : (
          <a href={ctaHref}>
            <Button
              variant={highlighted ? "default" : "outline"}
              className="w-full"
            >
              {cta}
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
