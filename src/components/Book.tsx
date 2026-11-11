"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useContent } from "./ContentContext";
import { primaryContact } from "./ContactPanel";

/** Página esquerda do livro: foto com moldura da cor da página. */
function Photo({ className = "" }: { className?: string }) {
  const { person } = useContent();
  return (
    <div className={`relative overflow-hidden rounded-[12px] bg-[#a9adb8] ${className}`}>
      <Image src="/me.webp" alt={person.name} fill sizes="(max-width: 768px) 90vw, 520px" className="object-cover object-[50%_30%]" priority />
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
        <RightPage withPhoto />
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
            className="absolute inset-0 title grid place-items-center rounded-[20px] bg-lavender text-[clamp(80px,12vw,180px)] leading-none tracking-[-0.04em] text-[#f2f3f3]"
            style={{ backfaceVisibility: "hidden" }}
          >
            {t.cover}
          </div>
          <div
            className="absolute inset-0 overflow-hidden rounded-[20px] bg-card-3 p-4"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <Photo className="h-full w-full" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function RightPage({ withPhoto = false }: { withPhoto?: boolean }) {
  const { person, t, projects } = useContent();
  const cta = primaryContact(t);
  return (
    <div className="book-scroll h-full overflow-y-auto px-6 pt-10 pb-8 md:px-8">
      {withPhoto && <Photo className="-mt-4 mb-6 aspect-[4/3] w-full" />}
      <div className="relative">
        <p className="text-[18px] text-fog">{t.hi} {person.firstName}</p>
        <div aria-hidden className="pointer-events-none mt-2 font-plex text-[clamp(52px,6.5vw,88px)] leading-[1] font-medium tracking-[-0.04em] text-lavender">
          {person.handle}
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
      <ul className="mt-3 divide-y divide-tint/[0.07] border-t border-tint/[0.07]">
        {projects.map((p) => (
          <li key={p.slug} className="grid grid-cols-[52px_1fr] gap-x-3 py-3">
            <span className="font-mono text-[13px] text-fog pt-1">{p.year}</span>
            <div>
              <div className="title text-[19px]">{p.name}</div>
              <div className="text-[15px] text-fog">{p.role}</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full border border-tint/15 px-2.5 py-0.5 font-mono text-[11px] text-fog">
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
