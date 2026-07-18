import Link from "next/link";
import { ArrowLeft, BookOpen, MessageCircle, Calendar, Globe, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPhilosopherBySlug, getFirstPassageOfWork } from "@/lib/data";
import { KnowledgeGraphMini } from "@/components/study/mini-graph";
import { RelatedPhilosopherRow } from "@/components/study/related-philosophers";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const phil = await getPhilosopherBySlug(slug);
  return {
    title: `${phil.name} — Philo`,
    description: phil.bioShort ?? `Read the works of ${phil.name} in the Philo corpus.`,
  };
}

export default async function PhilosopherProfilePage({ params }: Props) {
  const { slug } = await params;
  const phil = await getPhilosopherBySlug(slug);

  // Build read links for each work (first passage)
  const workLinks: Record<string, string> = {};
  for (const work of phil.works) {
    if (work.chapterCount > 0) {
      const first = await getFirstPassageOfWork(work.id);
      if (first) {
        workLinks[work.id] = `/philo/sophy/${slug}/read/${work.id}/${first.chapterId}/${first.id}`;
      }
    }
  }

  return (
    <div className="container py-6 md:py-10 max-w-4xl animate-fade-in">
      {/* Back */}
      <Button variant="ghost" size="icon" className="mb-6" asChild>
        <Link href="/philo/sophy">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>

      {/* Profile header */}
      <div className="scholar-card mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="font-serif text-4xl font-bold text-primary">
              {phil.name[0]}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              {phil.name}
            </h1>
            {phil.nameNative && (
              <p className="text-sm text-muted-foreground italic mt-0.5">
                {phil.nameNative}
              </p>
            )}
            <p className="text-sm mt-3 leading-relaxed">
              {phil.bioFull ?? phil.bioShort}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-muted-foreground">
              {(phil.birthYear || phil.deathYear) && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {phil.birthYear
                    ? `${phil.birthYear}–${phil.deathYear ?? "present"}`
                    : `d. ${phil.deathYear}`}
                </span>
              )}
              {phil.tradition && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {phil.tradition}
                </span>
              )}
              {phil.category && (
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {phil.category}
                </span>
              )}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {phil.works.length > 0 && (
                <Button asChild>
                  <Link href="#works">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read Works ({phil.works.length})
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href={`/philo/sophy/${slug}/tutor`}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Talk to His AI
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Works section */}
      {phil.works.length > 0 && (
        <section id="works" className="mb-8">
          <h2 className="font-serif text-xl font-semibold mb-4">
            Key Works ({phil.works.length})
          </h2>
          <div className="space-y-3">
            {phil.works.map((work) => (
              <Link
                key={work.id}
                href={workLinks[work.id] ?? `#`}
                className={`scholar-card block transition-all duration-200 ${
                  workLinks[work.id] ? "hover:border-primary/30" : "opacity-60 cursor-default"
                }`}
              >
                <div className="flex items-start gap-3">
                  <BookMarked className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="font-serif font-semibold">{work.title}</h3>
                      {work.titleOriginal && (
                        <span className="text-xs text-muted-foreground italic">
                          {work.titleOriginal}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {work.yearWritten && <>c. {work.yearWritten} &middot; </>}
                      {work.chapterCount} chapter{work.chapterCount !== 1 ? "s" : ""}
                      {work.language && <> &middot; {work.language.toUpperCase()}</>}
                    </p>
                    {work.chapterCount === 0 && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Coming soon — passages not yet ingested
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related philosophers */}
      {phil.related.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold mb-4">
            Related Philosophers
          </h2>
          <RelatedPhilosopherRow related={phil.related} />
        </section>
      )}

      {/* Knowledge Graph Mini */}
      <section>
        <h2 className="font-serif text-xl font-semibold mb-4">
          Your Knowledge Graph
        </h2>
        <KnowledgeGraphMini philosopherId={phil.id} philosopherSlug={slug} />
      </section>
    </div>
  );
}
