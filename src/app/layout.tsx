import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Mrs_Saint_Delafield } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const signature = Mrs_Saint_Delafield({ variable: "--font-signature", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Jhonatan Ribeiro — Portfólio",
  description: "Sites, plataformas e SaaS construídos do zero ao ar: produto, design e código.",
};

export const viewport: Viewport = {
  themeColor: "#151a1a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} ${signature.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
