"use client";

import { AnimatePresence, motion } from "motion/react";
import { useContent } from "./ContentContext";
import { setTheme, useTheme } from "./theme";

/** Botão sol/lua para alternar entre tema escuro e claro. */
export default function ThemeToggle() {
  const theme = useTheme();
  const { t } = useContent();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={next === "light" ? t.themeLight : t.themeDark}
      title={next === "light" ? t.themeLight : t.themeDark}
      className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-glass text-bone transition hover:bg-glass-hover"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.22 }}
          className="grid place-items-center"
        >
          {theme === "dark" ? (
            // lua: está no escuro, clique para clarear
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
