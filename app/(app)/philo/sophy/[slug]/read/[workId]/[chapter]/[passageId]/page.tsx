import Link from "next/link";
import { ArrowLeft, Menu, Settings, PenTool, Mic, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChapterNav } from "@/components/reader/chapter-nav";
import { getPassage, getChapters, getPreviousPassage, getNextPassage } from "@/lib/data";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
    workId: string;
    chapter: string;
    passageId: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, passageId } = await params;
  const passage = await getPassage(passageId);
  if (!passage) return { title: "Passage not found — Philo" };
  return {
    title: `${passage.chapterTitle}, §${passage.passageOffset} — ${passage.philosopherName} — Philo`,
    description: passage.content.slice(0, 160),
  };
}

export default async function ReaderPage({ params }: Props) {
  const { slug, workId, chapter, passageId } = await params;
  const passage = await getPassage(passageId);
  if (!passage) notFound();

  const chapters = await getChapters(workId);
  const prev = await getPreviousPassage(passageId, workId);
  const next = await getNextPassage(passageId, workId);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 border-r flex-col bg-card/50 shrink-0">
        <div className="p-4 border-b">
          <Button variant="ghost" size="icon" className="mb-2" asChild>
            <Link href={`/philo/sophy/${slug}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="font-serif font-semibold text-sm">
            {passage.workTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ScrollArea className="flex-1 p-4">
          <ChapterNav
            chapters={chapters}
            currentChapterId={passage.chapterId}
            currentPassageOffset={passage.passageOffset}
            philosopherSlug={slug}
            workId={workId}
          />
        </ScrollArea>
      </aside>

      {/* Main reader area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* Reader header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href={`/philo/sophy/${slug}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="font-serif text-sm md:text-base font-semibold truncate">
                {passage.chapterTitle}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {passage.workTitle} &middot; §{passage.passageOffset}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
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

        {/* Navigation bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b shrink-0 bg-card/30">
          {prev ? (
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={`/philo/sophy/${slug}/read/${workId}/${chapter}/${prev.id}`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            </Button>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            §{passage.passageOffset}
          </span>
          {next ? (
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={`/philo/sophy/${slug}/read/${workId}/${chapter}/${next.id}`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          ) : (
            <span />
          )}
        </div>

        {/* Passage content */}
        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto p-6 md:p-12">
            <article className="reader-text whitespace-pre-line leading-relaxed text-foreground/90 select-text">
              {passage.content}
            </article>

            {/* Stable anchor */}
            <div className="mt-8 p-4 rounded-lg border bg-card/50">
              <p className="text-xs text-muted-foreground font-mono">
                Passage anchor: {passage.anchor}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This identifier is stable forever and binds all notes,
                highlights, and voice annotations to this passage.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Notes panel (desktop placeholder) */}
      <aside className="hidden lg:flex w-80 border-l flex-col bg-card/30 shrink-0">
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
