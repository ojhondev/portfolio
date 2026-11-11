"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useContent } from "./ContentContext";
import { primaryContact } from "./ContactPanel";

const DOT_COLORS = ["#aca0fc", "#dcf34a", "#ff5a1f", "#3fb6ff", "#ff7ac8", "#2ec27e", "#ffd23f"];

function DotWall() {
  const { person } = useContent();
  // padrão de pontos determinístico (sem Math.random para não variar no SSR)
  const cols = 9;
  const rows = 12;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f4f1ea]">
      <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)` }}>
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} className="grid place-items-center">
            <span
              className="block aspect-square w-[58%] rounded-full"
              style={{ background: DOT_COLORS[(i * 5 + Math.floor(i / cols) * 3) % DOT_COLORS.length] }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 top-[38%] grid place-items-center">
        <div className="grid aspect-square w-[62%] place-items-center rounded-full bg-[#151a1a] text-[clamp(56px,9vw,120px)] leading-none tracking-[-0.04em] text-bone">
          {person.initials}
        </div>
      </div>
    </div>
  );
}

export default function Book({ pageW, pageH }: { pageW: number; pageH: number }) {
  const { t } = useContent();
  const [flipped, setFlipped] = useState(false);
  const single = pageW * 2 > (typeof window !== "undefined" ? window.innerWidth - 24 : 9999);

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 750);
    return () => clearTimeout(t);
  }, []);

  if (single) {
    // telas estreitas: só a página da bio, com a capa saindo
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="relative overflow-hidden rounded-[20px] bg-card-3"
        style={{ width: pageW, height: pageH }}
      >
        <RightPage />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 60 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="relative"
      style={{ width: pageW * 2 + 8, height: pageH, perspective: 2400 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ x: -pageW / 2 }}
        animate={{ x: flipped ? 0 : -pageW / 2 }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* página direita: bio */}
        <div className="absolute top-0 overflow-hidden rounded-[20px] bg-card-3" style={{ left: pageW + 8, width: pageW, height: pageH }}>
          <RightPage />
        </div>
        {/* capa: frente lilás "Oi", verso = página esquerda */}
        <motion.div
          className="absolute top-0 cursor-pointer"
          style={{ left: pageW + 8, width: pageW, height: pageH, transformOrigin: "-4px 50%", transformStyle: "preserve-3d" }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: flipped ? -180 : 0 }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          onClick={() => setFlipped((f) => !f)}
        >
          <div
            className="absolute inset-0 grid place-items-center rounded-[20px] bg-lavender text-[clamp(80px,12vw,180px)] leading-none tracking-[-0.04em] text-bone"
            style={{ backfaceVisibility: "hidden" }}
          >
            {t.cover}
          </div>
          <div
            className="absolute inset-0 overflow-hidden rounded-[20px] border-[6px] border-card-3"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <DotWall />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function RightPage() {
  const { person, t, projects } = useContent();
  const cta = primaryContact(t);
  return (
    <div className="book-scroll h-full overflow-y-auto px-6 pt-10 pb-8 md:px-8">
      <div className="relative">
        <p className="text-[18px] text-fog">{t.hi} {person.firstName}</p>
        <div aria-hidden className="pointer-events-none font-signature mt-3 text-[clamp(72px,9vw,120px)] leading-[1] text-lavender">
          {person.firstName}
        </div>
      </div>
      <div className="mt-4 space-y-4 text-[19px] leading-[1.25]">
        {t.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <a
        href={cta.href}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex h-[54px] items-center justify-between rounded-[36px] bg-lavender px-5 text-[17px] text-ink transition hover:brightness-105"
      >
        {t.letsTalk} <span aria-hidden>→</span>
      </a>

      <h4 className="mt-10 text-[15px] text-fog">{t.projects}</h4>
      <ul className="mt-3 divide-y divide-white/[0.07] border-t border-white/[0.07]">
        {projects.map((p) => (
          <li key={p.slug} className="grid grid-cols-[52px_1fr] gap-x-3 py-3">
            <span className="font-mono text-[13px] text-fog pt-1">{p.year}</span>
            <div>
              <div className="text-[19px]">{p.name}</div>
              <div className="text-[15px] text-fog">{p.role}</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[11px] text-fog">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <h4 className="mt-10 text-[15px] text-fog">{t.stack}</h4>
      <p className="mt-2 text-[17px] leading-[1.3]">
        Next.js · React · TypeScript · Tailwind · shadcn/ui · GSAP · Motion · Postgres (Neon) · Drizzle · Vercel · AI
      </p>
    </div>
  );
}
