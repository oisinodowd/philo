import Link from "next/link";
import { ArrowLeft, BookOpen, Settings, Menu, PenTool, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Placeholder passage content
const PASSAGE = {
  workTitle: "Summa Theologica",
  chapterTitle: "Treatise on Sacred Doctrine (Q1)",
  passageNumber: 1,
  content: `Whether, besides philosophy, any further doctrine is required?

Objection 1: It seems that, besides philosophical science, we have no need of any further knowledge. For man should not seek to know what is above reason: "Seek not the things that are too high for thee" (Ecclus. 3:22). But whatever is not above reason is fully treated of in philosophical science. Therefore any other knowledge besides philosophical science is superfluous.

Objection 2: Further, knowledge can be concerned only with being, for nothing can be known, save what is true; and all that is, is true. But everything that is, is treated of in philosophical science — even God Himself; so that there is a part of philosophy called theology, or the divine science, as Aristotle has proved. Therefore, besides philosophical science, there is no need of any further knowledge.

On the contrary, It is written (2 Tim. 3:16): "All Scripture, inspired of God, is profitable to teach, to reprove, to correct, to instruct in justice." Now Scripture, inspired of God, is no part of philosophical science, which has been built up by human reason. Therefore it is useful that besides philosophical science, there should be other knowledge, i.e., inspired of God.

I answer that, It was necessary for man's salvation that there should be a knowledge revealed by God besides philosophical science built up by human reason. Firstly, indeed, because man is directed to God, as to an end that surpasses the grasp of his reason...`,
};

export default function ReaderPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 border-r flex-col bg-card/50">
        <div className="p-4 border-b">
          <Button variant="ghost" size="icon" className="mb-2" asChild>
            <Link href="/philo/sophy/thomas-aquinas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="font-serif font-semibold text-sm">
            {PASSAGE.workTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {PASSAGE.chapterTitle}
          </p>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-1">
            {Array.from({ length: 8 }, (_, i) => (
              <Button
                key={i}
                variant={i === 0 ? "secondary" : "ghost"}
                className="w-full justify-start text-xs"
                size="sm"
              >
                Article {i + 1}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main reader area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Reader header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/philo/sophy/thomas-aquinas">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <div className="hidden md:block">
            <h1 className="font-serif text-lg font-semibold">
              {PASSAGE.chapterTitle}
            </h1>
            <p className="text-xs text-muted-foreground">
              {PASSAGE.workTitle} &middot; Article {PASSAGE.passageNumber}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" title="Highlight">
              <PenTool className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Record voice note">
              <Mic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Passage content */}
        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto p-6 md:p-12">
            <article className="reader-text whitespace-pre-line leading-relaxed text-foreground/90">
              {PASSAGE.content}
            </article>

            {/* Passage anchor info */}
            <div className="mt-8 p-4 rounded-lg border bg-card/50">
              <p className="text-xs text-muted-foreground font-mono">
                Passage anchor: thomas-aquinas::1:1:1
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This identifier is stable forever and binds all notes,
                highlights, and voice annotations.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Notes panel (desktop) */}
      <aside className="hidden lg:flex w-80 border-l flex-col bg-card/30">
        <div className="p-4 border-b">
          <h3 className="font-serif font-semibold text-sm">Notes &amp; Annotations</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="text-center py-12">
            <PenTool className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-3">
              Select text to highlight or add notes.
              Your annotations are bound to this passage forever.
            </p>
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
