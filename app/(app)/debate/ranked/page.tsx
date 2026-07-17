import Link from "next/link";
import { ArrowLeft, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Ranked Debate",
};

export default function RankedPage() {
  return (
    <div className="container py-6 md:py-10 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/debate">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-bold">Ranked Debate</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Climb the ladder. Prove your philosophical rigor.
          </p>
        </div>
      </div>

      {/* Queue card */}
      <div className="scholar-card mb-8">
        <div className="flex flex-col items-center text-center py-8">
          <Trophy className="h-12 w-12 text-primary mb-4" />
          <h2 className="font-serif text-xl font-semibold">Join Queue</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            You will be assigned a topic and side. An opponent with the opposite
            assignment will be matched automatically.
          </p>
          <div className="mt-6 flex gap-3">
            <Button>Join Ranked Queue</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Free users: limited daily matches. Premium: unlimited.
          </p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="scholar-card">
        <h2 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Leaderboard
        </h2>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center py-8">
            Rankings will appear here once matches are played and judged.
          </p>
        </div>
      </div>
    </div>
  );
}
