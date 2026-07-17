import Link from "next/link";
import { Swords, Bot, Users, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Debate",
};

export default function DebatePage() {
  const modes = [
    {
      href: "/debate/practice",
      icon: Bot,
      title: "Practice",
      desc: "Debate AI opponents at three difficulty levels. Perfect your arguments before facing humans.",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      href: "/debate/unranked",
      icon: Users,
      title: "Unranked",
      desc: "Match with another scholar. Choose your topic, format, and side. No stakes — just good debate.",
      color: "bg-green-500/10 text-green-600",
    },
    {
      href: "/debate/ranked",
      icon: Trophy,
      title: "Ranked",
      desc: "Climb the ladder. Forced topic and side assignments. ELO tracking. Premium gets unlimited matches.",
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="container py-6 md:py-10 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold">
          Debate Arena
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your mode and enter the arena.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {modes.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="scholar-card group hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center p-6">
              <div
                className={`h-14 w-14 rounded-full ${mode.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <mode.icon className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-semibold">
                {mode.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {mode.desc}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-primary font-medium">
                Enter
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Leaderboard preview */}
      <div className="mt-12 p-6 rounded-lg border bg-card/50">
        <h2 className="font-serif text-lg font-semibold mb-4">
          Top Debaters This Week
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center py-6">
            Leaderboard data will populate once matches are played.
          </p>
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/debate/ranked">
              View Full Leaderboard
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
