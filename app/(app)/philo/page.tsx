import Link from "next/link";
import { BookOpen, Swords, ArrowRight, Search, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Philo",
};

export default function PhiloHomePage() {
  return (
    <div className="container py-8 md:py-12 max-w-3xl animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          What would you like to do?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your philosophical journey begins here.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Study Card */}
        <Link
          href="/philo/sophy"
          className="scholar-card group hover:border-primary/30 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center p-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold">Study</h2>
            <p className="mt-3 text-muted-foreground text-sm max-w-xs">
              Browse philosophers by tradition and time period. Read original
              works, annotate passages, and build your knowledge graph.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-primary font-medium">
              Browse philosophers
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Debate Card */}
        <Link
          href="/debate"
          className="scholar-card group hover:border-primary/30 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center p-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <Swords className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold">Debate</h2>
            <p className="mt-3 text-muted-foreground text-sm max-w-xs">
              Practice against AI opponents, go unranked with peers, or climb
              the ranked ladder. Matches judged by a five-persona AI panel.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-primary font-medium">
              Enter the arena
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick stats / continue where you left off */}
      <div className="mt-12 p-6 rounded-lg border bg-card/50 text-center">
        <p className="text-sm text-muted-foreground">
          Sign in to track your readings, build your knowledge graph, and earn
          energy charges for daily engagement.
        </p>
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/account">
              <GraduationCap className="mr-2 h-4 w-4" />
              View Your Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
