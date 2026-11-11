import type { Metadata, Viewport } from "next";
import { Geist_Mono, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { getContent, isLocale, localePath, locales } from "@/content";
import "../globals.css";

// Space Grotesk: Regular no texto, Bold nos títulos.
const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const plex = IBM_Plex_Mono({ variable: "--font-plex", subsets: ["latin"], weight: ["400", "500"] });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { t } = getContent(lang);
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: localePath(lang),
      languages: Object.fromEntries(locales.map((l) => [l === "pt" ? "pt-BR" : l, localePath(l)])),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#151a1a",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang === "pt" ? "pt-BR" : "en"} className={`${display.variable} ${geistMono.variable} ${plex.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
