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
  title: "MattDESIGN.AI — Le designer IA premium",
  description:
    "Le designer IA premium pour créer des sites qui inspirent confiance. Générez landing pages, logos, assets et design systems professionnels en quelques minutes.",
  icons: {
    icon: [
      { url: "/assets/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/assets/logo-icon.svg",
  },
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
