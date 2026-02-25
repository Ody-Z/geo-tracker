"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandCard } from "@/components/dashboard/BrandCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus, Loader2, Radar } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  domain: string | null;
  scans: {
    id: string;
    overallScore: number | null;
    createdAt: string;
    status: string;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  // New brand form
  const [brandName, setBrandName] = useState("");
  const [domain, setDomain] = useState("");
  const [queries, setQueries] = useState([""]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    try {
      const res = await fetch("/api/brands");
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBrand(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    const filteredQueries = queries.filter((q) => q.trim().length >= 10);
    if (!brandName.trim() || filteredQueries.length === 0) {
      setError("Brand name and at least one query (10+ chars) required");
      setCreating(false);
      return;
    }

    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brandName.trim(),
          domain: domain.trim() || undefined,
          queries: filteredQueries,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create brand");
        setCreating(false);
        return;
      }

      // Reset form
      setBrandName("");
      setDomain("");
      setQueries([""]);
      setShowForm(false);
      setCreating(false);
      await fetchBrands();
    } catch {
      setError("Something went wrong");
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Brands</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track AI visibility for your brands
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Add a New Brand</CardTitle>
            <CardDescription>
              Enter your brand details and queries to start tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBrand} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand Name *</label>
                  <Input
                    placeholder="e.g., Acme Corp"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Domain</label>
                  <Input
                    placeholder="e.g., acme.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Queries ({queries.length}/10)
                </label>
                {queries.map((q, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="What query would a customer ask AI about your brand?"
                      value={q}
                      onChange={(e) => {
                        const updated = [...queries];
                        updated[i] = e.target.value;
                        setQueries(updated);
                      }}
                    />
                    {queries.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setQueries(queries.filter((_, j) => j !== i))
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                {queries.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQueries([...queries, ""])}
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add query
                  </Button>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Brand"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {brands.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Radar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">No brands yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first brand to start tracking AI visibility.
            </p>
            <Button
              className="mt-4 gap-2"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4" />
              Add Your First Brand
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              id={brand.id}
              name={brand.name}
              domain={brand.domain}
              scans={brand.scans}
            />
          ))}
        </div>
      )}
    </div>
  );
}
