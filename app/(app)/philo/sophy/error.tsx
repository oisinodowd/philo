"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SophyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-16 max-w-md mx-auto text-center animate-fade-in">
      <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
      <h2 className="font-serif text-xl font-semibold mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        We couldn&apos;t load the philosopher list. This may be a temporary issue.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/philo">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
