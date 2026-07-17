import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PhiloTutorPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b shrink-0">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/philo/sophy/thomas-aquinas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-lg font-semibold">
            Talk to Saint Thomas Aquinas
          </h1>
          <p className="text-xs text-muted-foreground">
            AI tutor — strict RAG from the corpus
          </p>
        </div>
      </div>

      {/* Chat area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <span className="text-xs font-bold text-primary">A</span>
            </div>
            <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
              <p className="text-sm">
                Pax tibi. I am Saint Thomas Aquinas. Ask me anything about my
                works — the <em>Summa Theologica</em>, the{" "}
                <em>Summa contra Gentiles</em>, or any of my commentaries. I
                will answer only from what I have written.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4 shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder="Ask Aquinas a question about his works..."
            className="flex-1"
          />
          <Button size="icon">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Answers are generated from the corpus. If a topic isn&apos;t covered,
          Aquinas will tell you honestly.
        </p>
      </div>
    </div>
  );
}
