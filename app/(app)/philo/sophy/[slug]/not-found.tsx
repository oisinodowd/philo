import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SophyNotFound() {
  return (
    <div className="container py-16 max-w-md mx-auto text-center animate-fade-in">
      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h2 className="font-serif text-xl font-semibold mb-2">
        Philosopher not found
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        This philosopher may not be in the corpus yet, or the URL may be incorrect.
      </p>
      <Button asChild>
        <Link href="/philo/sophy">Browse all philosophers</Link>
      </Button>
    </div>
  );
}
