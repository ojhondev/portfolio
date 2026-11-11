"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { contact } from "@/content";
import { useContent } from "./ContentContext";
import LanguageSwitch from "./LanguageSwitch";
import { useClock } from "./useViewport";

function Clock({ timeZone }: { timeZone: string }) {
  const { h, m, s } = useClock(timeZone);
  const hr = ((h % 12) + m / 60) * 30;
  const mn = (m + s / 60) * 6;
  const sc = s * 6;
  return (
    <svg viewBox="0 0 200 200" className="aspect-square w-full">
      <circle cx="100" cy="100" r="100" fill="#fcfcfc" />
      {Array.from({ length: 60 }).map((_, i) => {
        const big = i % 5 === 0;
        return (
          <line
            key={i}
            x1="100"
            y1={big ? 10 : 12}
            x2="100"
            y2={big ? 24 : 17}
            stroke="#151a1a"
            strokeOpacity={big ? 0.9 : 0.35}
            strokeWidth={big ? 3 : 1.2}
            strokeLinecap="round"
            transform={`rotate(${i * 6} 100 100)`}
          />
        );
      })}
      <line x1="100" y1="100" x2="100" y2="52" stroke="#151a1a" strokeWidth="6" strokeLinecap="round" transform={`rotate(${hr} 100 100)`} />
      <line x1="100" y1="100" x2="100" y2="30" stroke="#151a1a" strokeWidth="4" strokeLinecap="round" transform={`rotate(${mn} 100 100)`} />
      <g transform={`rotate(${sc} 100 100)`} style={{ transition: s === 0 ? "none" : "transform .25s cubic-bezier(.4,2.2,.6,1)" }}>
        <line x1="100" y1="118" x2="100" y2="22" stroke="#aca0fc" strokeWidth="2" strokeLinecap="round" />
        <circle cx="100" cy="100" r="4.5" fill="#aca0fc" />
      </g>
    </svg>
  );
}

export function primaryContact(t: ReturnType<typeof useContent>["t"]) {
  if (contact.whatsapp) return { label: t.ctaWhatsapp, href: `https://wa.me/${contact.whatsapp}` };
  if (contact.email) return { label: t.ctaEmail, href: `mailto:${contact.email}` };
  return { label: t.ctaGithub, href: contact.github };
}

export default function ContactPanel() {
  const { person, t } = useContent();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { label: time } = useClock(person.timeZone);
  const primary = primaryContact(t);

  return (
    <div className="fixed top-2.5 right-2.5 z-50 flex items-start gap-1.5">
      <AnimatePresence initial={false}>
        {!open && (
          <motion.div key="lang" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            <LanguageSwitch />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{ transformOrigin: "top right" }}
            className="w-[min(340px,calc(100vw-20px))] rounded-[24px] bg-[rgba(48,54,54,0.82)] p-1 backdrop-blur-xl"
          >
            <div className="rounded-[20px] bg-white/[0.04]">
              <div className="flex items-center justify-between px-3 pt-3">
                <span className="flex items-center gap-2 rounded-full bg-white/[0.06] py-1 pr-3 pl-3 text-[15px]">
                  {person.available ? t.available : t.busy}
                  <span className={`size-3 rounded-full ${person.available ? "bg-lavender" : "bg-ash"}`} />
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t.closeContact}
                  className="grid size-9 place-items-center rounded-full text-fog transition hover:bg-white/10 hover:text-bone"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" /></svg>
                </button>
              </div>
              <div className="px-5 py-4">
                <Clock timeZone={person.timeZone} />
              </div>
              <div className="px-5 pb-5">
                <h3 className="title text-[22px] leading-[1.1]">{t.availability}</h3>
                <p className="mt-2 text-[15px] text-fog">{t.availabilityNote}</p>
                <p className="mt-1 text-[15px] text-fog">
                  {person.city} · {time}
                </p>
              </div>
            </div>
            <a
              href={primary.href}
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex h-[54px] items-center justify-between rounded-[36px] bg-lavender px-5 text-[17px] text-ink transition hover:brightness-105"
            >
              {primary.label} <span aria-hidden>→</span>
            </a>
            {contact.email && (
              <div className="mt-1 flex h-[54px] items-center justify-between rounded-[36px] bg-white/[0.05] px-5 text-[17px]">
                <a href={`mailto:${contact.email}`} className="truncate hover:underline">{contact.email}</a>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(contact.email);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                  }}
                  className="text-[15px] text-fog hover:text-bone"
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
            )}
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex h-[54px] items-center justify-between rounded-[36px] bg-white/[0.05] px-5 text-[17px] transition hover:bg-white/10"
            >
              github.com/ojhondev <span aria-hidden>→</span>
            </a>
          </motion.div>
        ) : (
          <motion.button
            key="btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            className="group flex h-10 items-center gap-2 rounded-full bg-[rgba(48,54,54,0.82)] pr-3 pl-4 text-[17px] backdrop-blur-xl transition hover:bg-[rgba(70,78,78,0.9)]"
          >
            {t.contact}
            <svg width="16" height="16" viewBox="0 0 16 16" className="transition-transform duration-300 group-hover:rotate-90">
              <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
