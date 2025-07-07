import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AISupport - Plateforme SaaS de Support Client IA",
  description: "Transformez votre support client avec l'intelligence artificielle. Chat IA avancé, automatisation intelligente et insights en temps réel.",
  keywords: "support client IA, chatbot intelligent, SaaS, automatisation, GPT-4, Claude AI",
  openGraph: {
    title: "AISupport - Support Client Révolutionnaire avec IA",
    description: "La plateforme SaaS qui révolutionne le support client grâce à l'IA. Essai gratuit disponible.",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://aisupport.fr",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}