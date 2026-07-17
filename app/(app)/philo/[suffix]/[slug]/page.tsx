import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SuffixSlugPage({
  params,
}: {
  params: Promise<{ suffix: string; slug: string }>;
}) {
  const { suffix, slug } = await params;

  return (
    <div className="container py-12 max-w-3xl animate-fade-in">
      <Button variant="ghost" size="icon" className="mb-6" asChild>
        <Link href={`/philo/${suffix}`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>

      <div className="scholar-card text-center py-16">
        <User className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="font-serif text-2xl font-bold mt-4 capitalize">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          This philosopher page under &ldquo;{suffix}&rdquo; has not yet been
          populated. Content and corpus will be added in a future release.
        </p>
        <div className="mt-6">
          <Button variant="outline" asChild>
            <Link href={`/philo/${suffix}`}>
              Back to {suffix}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
