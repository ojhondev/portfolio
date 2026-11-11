"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Content, Project } from "@/content";
import { ContentProvider, useContent } from "./ContentContext";
import BackgroundVideo from "./BackgroundVideo";
import Book from "./Book";
import ContactPanel from "./ContactPanel";
import HeroMural from "./HeroMural";
import { type Theme, useTheme } from "./theme";
import { useClock, useViewport } from "./useViewport";

export type Shot = { src: string; w: number; h: number };
export type WorkItem = Project & { images: Shot[] };

const TAB_H = 40;
const ROW = 44; // altura da faixa de abas quando uma pasta está aberta
const SPRING = { type: "spring", stiffness: 210, damping: 30, mass: 0.9 } as const;

// cores das pastas: cada camada um pouco mais clara (no tema claro, tons de papel)
function cardColor(i: number, n: number, theme: Theme) {
  const t = n > 1 ? i / (n - 1) : 0;
  if (theme === "light") {
    const l = 0.84 + t * 0.1;
    return `color(srgb ${(l * 1.0).toFixed(4)} ${(l * 1.002).toFixed(4)} ${(l * 0.985).toFixed(4)})`;
  }
  const l = 0.19 + t * 0.075;
  return `color(srgb ${l.toFixed(4)} ${(l * 1.105).toFixed(4)} ${(l * 1.105).toFixed(4)})`;
}

export default function Portfolio({ work, content }: { work: WorkItem[]; content: Content }) {
  return (
    <ContentProvider value={content}>
      <PortfolioView work={work} />
    </ContentProvider>
  );
}

function PortfolioView({ work }: { work: WorkItem[] }) {
  const { person, t } = useContent();
  const vp = useViewport();
  const clock = useClock(person.timeZone);
  const theme = useTheme();
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [book, setBook] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerH, setHeaderH] = useState(320);
  const n = work.length;
  const mobile = vp.w < 768;

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeaderH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const close = useCallback(() => {
    setActive(null);
    setBook(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (active !== null && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        const d = e.key === "ArrowRight" ? 1 : -1;
        setActive((a) => (a === null ? a : (a + d + n) % n));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, n]);

  // ---- geometria das pastas ----
  const W = vp.w;
  const H = vp.h;
  const visibleLast = Math.max(TAB_H + 36, 76);
  // telas baixas (notebook): mesma estrutura da tela grande, só a manchete um pouco menor
  // (26% da altura em ~640px, crescendo até 36% perto de 900px; acima disso ocupa a largura toda)
  const heroRatio = Math.min(0.36, Math.max(0.26, 0.26 + ((H - 640) / 260) * 0.1));
  const heroMax = !mobile && H < 900 ? Math.max(150, H * heroRatio) : Infinity;
  const top0 = Math.min(headerH, H - 160);
  const step = n > 1 ? Math.max(28, (H - top0 - visibleLast) / (n - 1)) : 0;
  const cardH = H - TAB_H - ROW + 1;
  const pad = mobile ? 12 : 64;
  const baseTabW = mobile ? Math.min(170, W * 0.44) : 210;
  // aberta: abas viram duas faixas (topo = anteriores + ativa, rodapé = seguintes), empacotadas
  const topCount = book ? 0 : active === null ? 0 : active + 1;
  const botCount = book ? n : active === null ? 0 : n - active - 1;
  const rowMax = Math.max(topCount, botCount, 1);
  const OVER = 18; // sobreposição entre abas vizinhas, como pastas de arquivo
  const rowTabW = Math.max(96, Math.min(baseTabW, (W - 56 + OVER * (rowMax - 1)) / rowMax));
  const tabW = () => (active === null && !book ? baseTabW : rowTabW);
  const tabX = (i: number) => {
    if (book || active !== null) {
      const k = book ? i : i <= (active as number) ? i : i - (active as number) - 1;
      return 48 + k * (rowTabW - OVER);
    }
    if (mobile) {
      return i % 2 === 0 ? 8 : W - baseTabW - 8;
    }
    return pad + (n > 1 ? (i * (W - baseTabW - pad * 2)) / (n - 1) : 0);
  };

  const yFor = (i: number) => {
    if (book) return H - ROW;
    if (active === null) {
      // no hover a pasta sobe o bastante para mostrar mais do site
      const lift = hover === i ? -Math.round(Math.min(56, Math.max(14, step * 0.6))) : 0;
      return top0 + i * step + lift;
    }
    if (i < active) return 0;
    if (i === active) return 0;
    return H - ROW;
  };

  const anyOpen = active !== null || book;

  return (
    <div className="relative h-dvh w-full overflow-hidden select-none">
      <ContactPanel />

      {/* vídeo de fundo atrás da manchete, entrando um pouco atrás das pastas */}
      <BackgroundVideo height={top0 + Math.min(220, H * 0.22)} hidden={anyOpen} />

      {/* cabeçalho + manchete */}
      <motion.header
        ref={headerRef}
        animate={{ opacity: anyOpen ? 0 : 1, filter: anyOpen ? "blur(6px)" : "blur(0px)" }}
        transition={{ duration: 0.5 }}
        className="relative z-0"
      >
        <nav className="grid grid-cols-2 gap-1 px-3 pt-4 pb-3 text-[15px] md:grid-cols-4 md:pr-[260px] md:text-[18px] [@media(min-width:768px)_and_(max-height:820px)]:pb-2 [@media(min-width:768px)_and_(max-height:820px)]:text-[16px]">
          <h3>{person.name}</h3>
          <h3 className="hidden md:block">{t.role}</h3>
          <h3 className="hidden md:block">{t.tagline}</h3>
          <h3 className="hidden md:block">
            <span className="tabular-nums">{clock.label}</span> {person.city}
          </h3>
        </nav>
        <div className="px-3 pt-1">
          <HeroMural text={t.headline} maxHeight={heroMax} theme={theme} paused={anyOpen} />
        </div>
        <div className="grid grid-cols-1 gap-1 px-3 pt-4 pb-5 text-[15px] md:grid-cols-4 md:text-[18px] [@media(min-width:768px)_and_(max-height:820px)]:pt-3 [@media(min-width:768px)_and_(max-height:820px)]:pb-4 [@media(min-width:768px)_and_(max-height:820px)]:text-[16px]">
          <h3 className="hidden md:block">{t.selectedWork}</h3>
          <p className="max-w-[560px] leading-[1.25] md:col-span-2">
            {t.intro}{" "}
            <button onClick={() => setBook(true)} className="text-lavender underline-offset-4 hover:underline">
              {t.learnMore}
            </button>
          </p>
        </div>
      </motion.header>

      {/* botão fechar */}
      <AnimatePresence>
        {anyOpen && (
          <motion.button
            key="close"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            onClick={close}
            aria-label={t.close}
            className="fixed top-1.5 left-2 z-[60] grid size-8 place-items-center rounded-full bg-lavender text-ink"
          >
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" /></svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* livro (bio) */}
      <AnimatePresence>
        {book && (
          <motion.div
            key="book"
            className="fixed inset-x-0 z-40 grid place-items-center"
            style={{ top: ROW, bottom: ROW }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Book
              pageH={Math.min(H - ROW * 2 - 16, 760)}
              pageW={Math.min((Math.min(H - ROW * 2 - 16, 760)) * 0.82, mobile ? W - 24 : 520)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* pastas */}
      <main className="absolute inset-0 z-10" style={{ pointerEvents: "none" }}>
        {vp.ready &&
          work.map((p, i) => {
            const isActive = active === i;
            const collapsedTop = anyOpen && !isActive && (active === null || i < active);
            const hideTabMobile = mobile && anyOpen && !isActive;
            return (
              <motion.section
                key={p.slug}
                className="absolute inset-x-0 top-0"
                initial={{ y: H + 40 }}
                animate={{ y: yFor(i) }}
                transition={{ ...SPRING, delay: !vp.ready ? 0 : 0 }}
                style={{ zIndex: 10 + i, height: cardH + TAB_H, pointerEvents: "none" }}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              >
                {/* aba */}
                <motion.button
                  onClick={() => {
                    setBook(false);
                    setActive((a) => (a === i ? null : i));
                  }}
                  onMouseEnter={() => !anyOpen && setHover(i)}
                  initial={false}
                  animate={{ opacity: hideTabMobile ? 0 : 1, left: mobile && isActive ? 44 : tabX(i), width: mobile && isActive ? baseTabW : tabW() }}
                  transition={SPRING}
                  className="folder-tab title absolute top-0 flex items-center justify-center text-[16px] md:text-[18px]"
                  style={{
                    height: TAB_H,
                    background: cardColor(i, n, theme),
                    pointerEvents: hideTabMobile ? "none" : "auto",
                    color: isActive ? "var(--color-bone)" : collapsedTop ? "var(--color-fog)" : "var(--color-bone)",
                  }}
                >
                  <span className="truncate px-[12%]">{p.name}</span>
                </motion.button>
                {/* corpo da pasta */}
                <div
                  className="absolute inset-x-0 overflow-hidden rounded-t-[14px]"
                  style={{
                    top: TAB_H - 1,
                    height: cardH,
                    background: cardColor(i, n, theme),
                    boxShadow:
                      theme === "light"
                        ? "0 -1px 0 rgba(255,255,255,0.7), 0 -14px 32px rgba(0,0,0,0.08)"
                        : "0 -1px 0 rgba(255,255,255,0.05), 0 -18px 40px rgba(0,0,0,0.25)",
                    pointerEvents: anyOpen ? (isActive ? "auto" : "none") : "auto",
                  }}
                  onMouseEnter={() => !anyOpen && setHover(i)}
                  onClick={() => !anyOpen && setActive(i)}
                >
                  <Gallery item={p} open={isActive} height={cardH} mobile={mobile} />
                </div>
              </motion.section>
            );
          })}
      </main>

      {/* navegação entre projetos no celular */}
      <AnimatePresence>
        {mobile && active !== null && (
          <motion.div
            key="mnav"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-0 bottom-0 z-[55] flex h-11 items-center justify-between px-3 text-[15px]"
          >
            <button onClick={() => setActive((a) => (a === null ? a : (a - 1 + n) % n))}>← {work[(active - 1 + n) % n].name}</button>
            <button onClick={() => setActive((a) => (a === null ? a : (a + 1) % n))}>{work[(active + 1) % n].name} →</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Gallery({ item, open, height, mobile }: { item: WorkItem; open: boolean; height: number; mobile: boolean }) {
  const { t } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const imgH = Math.max(160, height - (mobile ? 24 : 40));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!open) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open]);

  const [first, ...rest] = item.images;
  const imgs = (list: Shot[]) =>
    list.map((s, k) => {
      const w = Math.round((imgH * s.w) / s.h);
      return (
        <div key={s.src} className="relative shrink-0 overflow-hidden rounded-[14px] bg-black/20" style={{ width: w, height: imgH }}>
          <Image src={s.src} alt={`${item.name} — ${t.screen} ${k + 1}`} fill sizes={`${w}px`} className="object-cover object-top" draggable={false} />
        </div>
      );
    });

  if (mobile) {
    // celular: prints de desktop empilhados em colunas, prints de celular em altura cheia
    const vw = typeof window !== "undefined" ? window.innerWidth : 390;
    const dw = vw - 56;
    const dh = Math.round((dw * 900) / 1440);
    const per = Math.max(1, Math.floor((imgH + 10) / (dh + 10)));
    const desk = item.images.filter((s) => s.w > s.h);
    const mob = item.images.filter((s) => s.w <= s.h);
    const cols: Shot[][] = [];
    for (let i = 0; i < desk.length; i += per) cols.push(desk.slice(i, i + per));
    const tile = (s: Shot, w: number, h: number, k: number) => (
      <div key={s.src} className="relative shrink-0 overflow-hidden rounded-[12px] bg-black/20" style={{ width: w, height: h }}>
        <Image src={s.src} alt={`${item.name} — ${t.screen} ${k + 1}`} fill sizes={`${w}px`} className="object-cover object-top" draggable={false} />
      </div>
    );
    return (
      <div ref={ref} className={`gallery-scroll flex h-full gap-2.5 p-3 ${open ? "overflow-x-auto" : "overflow-hidden"}`}>
        {cols[0] && <div className="flex shrink-0 flex-col gap-2.5">{cols[0].map((s, k) => tile(s, dw, dh, k))}</div>}
        <Info item={item} height={imgH} mobile />
        {cols.slice(1).map((c, ci) => (
          <div key={ci} className="flex shrink-0 flex-col gap-2.5">
            {c.map((s, k) => tile(s, dw, dh, k))}
          </div>
        ))}
        {mob.map((s, k) => tile(s, Math.round((imgH * s.w) / s.h), imgH, k))}
        <div className="shrink-0" style={{ width: 4 }} />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`gallery-scroll flex h-full gap-2.5 ${open ? "overflow-x-auto" : "overflow-hidden"} ${mobile ? "p-3" : "p-5"}`}
      style={{ cursor: open ? "grab" : "pointer" }}
      onPointerDown={(e) => {
        if (!open || e.pointerType !== "mouse") return;
        drag.current = { x: e.clientX, left: ref.current!.scrollLeft, moved: false };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        if (Math.abs(dx) > 3) drag.current.moved = true;
        ref.current!.scrollLeft = drag.current.left - dx;
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      {first && imgs([first])}
      <Info item={item} height={imgH} mobile={mobile} />
      {imgs(rest)}
      <div className="shrink-0" style={{ width: 8 }} />
    </div>
  );
}

function Info({ item, height, mobile }: { item: WorkItem; height: number; mobile: boolean }) {
  const { t } = useContent();
  return (
    <article
      className="flex shrink-0 flex-col justify-between overflow-y-auto rounded-[14px] bg-tint/[0.045] p-5 md:p-6"
      style={{ width: mobile ? 300 : 380, height }}
    >
      <div>
        <h2 className="title text-[28px] leading-[1.05] md:text-[36px]">{item.name}</h2>
        <h4 className="mt-6 text-[15px] text-fog">{t.scope}</h4>
        <p className="mt-1.5 text-[17px] leading-[1.28] md:text-[18px]">{item.scope}</p>
      </div>
      <dl className="mt-6 grid grid-cols-[88px_1fr] gap-y-2.5 border-t border-tint/[0.08] pt-4 text-[15px]">
        <dt className="text-fog">{t.roleLabel}</dt>
        <dd>{item.role}</dd>
        <dt className="text-fog">{t.year}</dt>
        <dd className="font-mono text-[14px]">{item.year}</dd>
        <dt className="text-fog">{t.stack}</dt>
        <dd className="flex flex-wrap gap-1.5">
          {item.stack.map((s) => (
            <span key={s} className="rounded-full border border-tint/15 px-2.5 py-0.5 font-mono text-[11px] text-fog">
              {s}
            </span>
          ))}
        </dd>
        <dt className="text-fog">{t.links}</dt>
        <dd className="flex flex-wrap gap-x-4 gap-y-1">
          {item.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="underline decoration-tint/30 underline-offset-4 hover:decoration-bone" onClick={(e) => e.stopPropagation()}>
              {l.label}
            </a>
          ))}
        </dd>
      </dl>
    </article>
  );
}
