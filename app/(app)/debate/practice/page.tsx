import Link from "next/link";
import { ArrowLeft, Bot, Zap, Shield, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Practice Debate",
};

const AI_OPPONENTS = [
  {
    id: "socrates-easy",
    name: "Socrates",
    difficulty: "Easy",
    icon: Brain,
    desc: "The gadfly of Athens. Questions everything gently.",
  },
  {
    id: "aquinas-medium",
    name: "Aquinas AI",
    difficulty: "Medium",
    icon: Shield,
    desc: "Scholastic rigor with full corpus access.",
  },
  {
    id: "nietzsche-hard",
    name: "Zarathustra",
    difficulty: "Hard",
    icon: Zap,
    desc: "Unforgiving. Challenges every premise.",
  },
];

export default function PracticePage() {
  return (
    <div className="container py-6 md:py-10 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/debate">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-bold">Practice Debate</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hone your skills against AI opponents.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {AI_OPPONENTS.map((opponent) => (
          <div
            key={opponent.id}
            className="scholar-card flex items-center gap-4 group hover:border-primary/30 transition-all duration-200"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <opponent.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-semibold">{opponent.name}</h3>
              <p className="text-sm text-muted-foreground">{opponent.desc}</p>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full border">
              {opponent.difficulty}
            </span>
            <Button size="sm" className="ml-2">
              <Bot className="mr-1 h-3.5 w-3.5" />
              Debate
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
