import { Skeleton } from "@/components/ui/skeleton";

export default function PhilosopherProfileLoading() {
  return (
    <div className="container py-6 md:py-10 max-w-4xl animate-fade-in">
      <Skeleton className="h-10 w-10 rounded-md mb-6" />
      <div className="scholar-card mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-24 w-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
      </div>
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
