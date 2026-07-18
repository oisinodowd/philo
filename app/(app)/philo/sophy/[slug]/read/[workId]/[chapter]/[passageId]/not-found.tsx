import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PassagenotFound() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center max-w-sm p-8">
        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h2 className="font-serif text-lg font-semibold mb-2">
          Passage not found
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          This passage may have been removed, unpublished, or the URL is incorrect.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="sm">
            <Link href="/philo/sophy">Browse philosophers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
