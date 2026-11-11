import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: `${SITE_URL}/`, "pt-BR": `${SITE_URL}/pt` };
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${SITE_URL}/pt`, changeFrequency: "monthly", priority: 0.9, alternates: { languages } },
  ];
}
