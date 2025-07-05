import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CompareTelecom - Comparateur n°1 des offres mobiles et box internet",
  description: "Comparez gratuitement tous les forfaits mobiles et box internet. Trouvez la meilleure offre telecom et économisez jusqu'à 300€ par an. Gratuit et fiable.",
  keywords: "comparateur telecom, forfait mobile, box internet, fibre optique, 5G, comparaison offres",
  openGraph: {
    title: "CompareTelecom - Comparateur n°1 des offres telecom",
    description: "Trouvez la meilleure offre mobile ou box internet. Comparaison gratuite et transparente.",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://comparetelecom.fr",
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
        {children}
      </body>
    </html>
  );
}