import type { Metadata, Viewport } from "next";
import { Geist_Mono, Mrs_Saint_Delafield, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import { getContent, isLocale, localePath, locales } from "@/content";
import "../globals.css";

// Serifada livre (OFL) com tamanhos ópticos de texto e display; Bold no headline.
const serif = Newsreader({ variable: "--font-serif", subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const signature = Mrs_Saint_Delafield({ variable: "--font-signature", subsets: ["latin"], weight: "400" });

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
    <html lang={lang === "pt" ? "pt-BR" : "en"} className={`${serif.variable} ${geistMono.variable} ${signature.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
