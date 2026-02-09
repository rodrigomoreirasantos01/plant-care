"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onPlantAdded?: () => void;
  userName?: string;
}

export default function EmptyState({ onPlantAdded, userName }: EmptyStateProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/plants/seed", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to seed data");
      }

      setSuccess(true);

      // Notify the parent to re-fetch plants immediately
      if (onPlantAdded) {
        onPlantAdded();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-6xl">🌱</div>
        <h2 className="mb-2 text-xl font-semibold">
          {userName
            ? `Welcome, ${userName}! No plants yet`
            : "No plants yet"}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start by adding your first plant. We&apos;ll populate your dashboard
          with a demo Basil plant so you can see how everything works.
        </p>

        {success ? (
          <p className="text-sm font-medium text-green-600">
            Plant added successfully! Refreshing...
          </p>
        ) : (
          <Button onClick={handleSeed} disabled={loading} size="lg">
            {loading ? "Adding plant..." : "Add demo Basil plant"}
          </Button>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
