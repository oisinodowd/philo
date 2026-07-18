import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link href="/landing" className="flex items-center gap-2 mb-8">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-serif text-xl font-bold">Philo</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
