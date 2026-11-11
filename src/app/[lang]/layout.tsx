import type { Metadata, Viewport } from "next";
import { Geist_Mono, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { getContent, isLocale, localePath, locales, SITE_URL } from "@/content";
import { themeInitScript } from "@/theme-init";
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
  const { t, person } = getContent(lang);
  const url = localePath(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: t.metaTitle,
    description: t.metaDescription,
    keywords: t.metaKeywords,
    applicationName: person.handle,
    authors: [{ name: person.name, url: SITE_URL }],
    creator: person.name,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l === "pt" ? "pt-BR" : l, localePath(l)])),
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: person.handle,
      title: t.metaTitle,
      description: t.metaDescription,
      locale: lang === "pt" ? "pt_BR" : "en_US",
      alternateLocale: lang === "pt" ? ["en_US"] : ["pt_BR"],
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#151a1a",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { t, person } = getContent(lang);
  // dados estruturados (schema.org) para o Google entender quem é e o que faz
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: person.name,
        alternateName: person.handle,
        jobTitle: t.metaTitle.split(" - ")[0],
        description: t.metaDescription,
        url: SITE_URL,
        image: `${SITE_URL}/me.webp`,
        address: { "@type": "PostalAddress", addressLocality: person.city, addressCountry: "BR" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "FATEC" },
        knowsAbout: ["Web development", "App development", "Artificial intelligence", "Next.js", "SaaS"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: person.handle,
        inLanguage: lang === "pt" ? "pt-BR" : "en",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
  return (
    <html
      lang={lang === "pt" ? "pt-BR" : "en"}
      className={`${display.variable} ${geistMono.variable} ${plex.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
