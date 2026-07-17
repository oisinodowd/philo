import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SuffixPage({
  params,
}: {
  params: Promise<{ suffix: string }>;
}) {
  const { suffix } = await params;

  return (
    <div className="container py-12 max-w-3xl animate-fade-in">
      <Button variant="ghost" size="icon" className="mb-6" asChild>
        <Link href="/philo">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>

      <div className="scholar-card text-center py-16">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="font-serif text-2xl font-bold mt-4 capitalize">
          {suffix}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          This philosophical sub-namespace is reserved for future content. The
          corpus for &ldquo;{suffix}&rdquo; has not yet been populated.
        </p>
        <div className="mt-6">
          <Button variant="outline" asChild>
            <Link href="/philo/sophy">Browse Sophy (Active)</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
