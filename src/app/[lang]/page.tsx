import { readdirSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Portfolio, { type Shot, type WorkItem } from "@/components/Portfolio";
import { getContent, isLocale } from "@/content";

// Ordem dos prints: seções da home (desk-*), páginas internas (page-*), celular (mob-*)
const ORDER = ["desk", "page", "mob"];

function shotsFor(folder: string): Shot[] {
  const dir = path.join(process.cwd(), "public", "work", folder);
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  } catch {
    return [];
  }
  const rank = (f: string) => ORDER.findIndex((p) => f.startsWith(p));
  files.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, undefined, { numeric: true }));
  return files.map((f) => {
    const mob = f.startsWith("mob");
    return { src: `/work/${folder}/${f}`, w: mob ? 390 : 1440, h: mob ? 844 : 900 };
  });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = getContent(lang);
  const work: WorkItem[] = content.projects.map((p) => {
    const all = p.shots.map(shotsFor);
    // junta as pastas (ex.: SoftMotors + Tema Ranger): desktop antes de celular
    const desk = all.flatMap((s) => s.filter((x) => x.w > x.h));
    const mob = all.flatMap((s) => s.filter((x) => x.w < x.h));
    return { ...p, images: [...desk, ...mob] };
  });
  return <Portfolio work={work} content={content} />;
}
