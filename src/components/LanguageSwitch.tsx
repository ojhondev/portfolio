"use client";

import Link from "next/link";
import { localePath, locales } from "@/content";
import { useContent } from "./ContentContext";

/** Alternador EN / PT — pílula segmentada ao lado do botão de contato. */
export default function LanguageSwitch() {
  const { locale, t } = useContent();
  return (
    <nav
      aria-label={t.language}
      className="relative flex h-10 items-center rounded-full bg-glass p-1 text-[14px] backdrop-blur-xl"
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={localePath(l)}
            hrefLang={l === "pt" ? "pt-BR" : "en"}
            aria-current={active ? "page" : undefined}
            className={`relative grid h-8 min-w-10 place-items-center rounded-full px-3 font-mono uppercase transition ${
              active ? "bg-bone text-canvas" : "text-fog hover:text-bone"
            }`}
          >
            {l}
          </Link>
        );
      })}
    </nav>
  );
}
