import Link from "next/link";
import { ArrowLeft, BookOpen, MessageCircle, User, Calendar, Globe, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Saint Thomas Aquinas — Philo",
};

export default function PhilosopherProfilePage() {
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
              T
            </span>
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              Saint Thomas Aquinas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Doctor Angelicus &middot; Doctor Communis
            </p>
            <p className="text-sm mt-3 leading-relaxed">
              Dominican friar, philosopher, and theologian whose synthesis of
              Aristotelian philosophy with Christian doctrine defined
              scholasticism. His best-known works are the{" "}
              <em>Summa Theologica</em> and the <em>Summa contra Gentiles</em>.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                1225&ndash;1274
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Scholastic
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                Theology
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/philo/sophy/thomas-aquinas/read`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Works
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/philo/sophy/thomas-aquinas/tutor`}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Talk to His AI
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Works section */}
      <section className="mb-8">
        <h2 className="font-serif text-xl font-semibold mb-4">Key Works</h2>
        <div className="space-y-3">
          {[
            {
              title: "Summa Theologica",
              year: 1274,
              chapters: 8,
              desc: "The masterwork of scholastic philosophy and one of the most influential works of Western literature.",
            },
            {
              title: "Summa contra Gentiles",
              year: 1264,
              chapters: 0,
              desc: "A reasoned defense of Christian doctrine addressed to non-believers, structured around truths accessible to reason and those known by revelation.",
            },
            {
              title: "On Being and Essence",
              year: 1256,
              chapters: 0,
              desc: "A foundational treatise on metaphysics, distinguishing essence from existence and laying the groundwork for Thomistic ontology.",
            },
          ].map((work) => (
            <Link
              key={work.title}
              href={`/philo/sophy/thomas-aquinas/read/placeholder/1/1`}
              className="scholar-card block hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <BookMarked className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-serif font-semibold">{work.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    c. {work.year} &middot; {work.chapters} chapter
                    {work.chapters !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {work.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Knowledge Graph Preview */}
      <section>
        <h2 className="font-serif text-xl font-semibold mb-4">
          Knowledge Graph
        </h2>
        <div className="scholar-card h-48 flex items-center justify-center border-dashed">
          <p className="text-sm text-muted-foreground">
            Knowledge graph visualization will appear here as you read and
            annotate works.
          </p>
        </div>
      </section>
    </div>
  );
}
