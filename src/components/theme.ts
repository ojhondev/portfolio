"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
const KEY = "theme";

function read(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "dark");
}

export function setTheme(theme: Theme) {
  const el = document.documentElement;
  if (theme === "light") el.dataset.theme = "light";
  else delete el.dataset.theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
}
