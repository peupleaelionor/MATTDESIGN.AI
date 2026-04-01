import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MattDESIGN.AI — The AI Design System That Builds Itself",
  description:
    "From a one-line brief to a production-ready website. 10 AI agents. Brand DNA, copy, assets, code — in minutes. Free & open-source.",
  openGraph: {
    title: "MattDESIGN.AI — Design. Code. Ship. Automatically.",
    description:
      "10 AI agents. Brand DNA, copy, assets, and clean code — from a single brief.",
    siteName: "MattDESIGN.AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MattDESIGN.AI v3",
    description: "The self-improving AI design system.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
