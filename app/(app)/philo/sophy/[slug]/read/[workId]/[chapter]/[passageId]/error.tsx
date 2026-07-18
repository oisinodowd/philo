"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReaderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center max-w-sm p-8">
        <AlertTriangle className="h-10 w-10 mx-auto text-destructive mb-4" />
        <h2 className="font-serif text-lg font-semibold mb-2">
          Failed to load passage
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          This passage may not be available or there was a temporary error.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="default" size="sm">
            Try again
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/philo/sophy">Browse philosophers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
