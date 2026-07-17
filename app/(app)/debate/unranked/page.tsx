import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Unranked Debate",
};

export default function UnrankedPage() {
  return (
    <div className="container py-6 md:py-10 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/debate">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-bold">Unranked Debate</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Match with a peer on your own terms.
          </p>
        </div>
      </div>

      <div className="scholar-card text-center py-12">
        <Users className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="font-serif text-lg font-semibold mt-4">
          No opponents in lobby
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          When another scholar opens unranked matchmaking, they will appear here.
          You can select topics, format, and sides together.
        </p>
        <div className="mt-6">
          <Button variant="outline" disabled>
            Waiting for opponents...
          </Button>
        </div>
      </div>
    </div>
  );
}
