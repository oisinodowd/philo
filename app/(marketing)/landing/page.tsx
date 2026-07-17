import Link from "next/link";
import { BookOpen, BookMarked, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Philo — Philosophy, Studied",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-bold">Philo</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/philo">Enter App</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="py-20 md:py-32 text-center container max-w-3xl animate-fade-in">
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Philosophy, <span className="text-primary">Studied</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground text-balance">
            Read the great works. Annotate every passage. Debate with AI and
            fellow scholars. Build your philosophical knowledge graph.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/philo">
                Begin Your Study
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/debate/practice">
                Try a Debate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-t bg-card/50">
          <div className="container max-w-5xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="scholar-card text-center">
                <BookMarked className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-serif text-lg font-semibold mt-4">
                  Deep Reading
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Read philosopher&apos;s works with an elegant e-reader.
                  Highlight, annotate, and record voice notes anchored to every
                  passage.
                </p>
              </div>
              <div className="scholar-card text-center">
                <svg
                  className="h-10 w-10 mx-auto text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
                <h3 className="font-serif text-lg font-semibold mt-4">
                  AI Tutor
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Speak with each philosopher through their works. Strict
                  retrieval-augmented generation ensures answers stay faithful
                  to the corpus.
                </p>
              </div>
              <div className="scholar-card text-center">
                <svg
                  className="h-10 w-10 mx-auto text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                <h3 className="font-serif text-lg font-semibold mt-4">
                  Ranked Debate
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Practice against AI, spar unranked with peers, or climb the
                  ladder. A five-persona AI panel judges every match.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>
            Philo &mdash; Philosophy, Studied. Built for scholars, by scholars.
          </p>
        </div>
      </footer>
    </div>
  );
}
