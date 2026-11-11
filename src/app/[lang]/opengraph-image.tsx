import { ImageResponse } from "next/og";
import { getContent, isLocale } from "@/content";

// Imagem de compartilhamento (WhatsApp, LinkedIn, X...) gerada no build.
export const alt = "JhonDev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { t, person } = getContent(isLocale(lang) ? lang : "en");
  const [title] = t.metaTitle.split(" - ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#151a1a",
          color: "#f2f3f3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40 }}>
          <span style={{ display: "flex", color: "#aca0fc", fontWeight: 700 }}>&lt;j&gt;</span>
          <span style={{ display: "flex", fontWeight: 700 }}>{person.handle}</span>
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#8c9393" }}>
          <span style={{ display: "flex", width: 18, height: 18, borderRadius: 18, background: "#dcf34a" }} />
          devjhon.tech
        </div>
      </div>
    ),
    size,
  );
}
