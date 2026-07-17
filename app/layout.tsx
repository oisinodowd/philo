import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Philo",
    default: "Philo — Philosophy, Studied",
  },
  description:
    "A scholarly platform for reading, annotating, and debating the great works of philosophy. AI-powered tutor, knowledge graphs, and ranked debate.",
  keywords: [
    "philosophy",
    "study",
    "debate",
    "aquinas",
    "reader",
    "annotations",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
