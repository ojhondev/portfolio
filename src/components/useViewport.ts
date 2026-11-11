"use client";

import { useEffect, useState } from "react";

export function useViewport() {
  const [vp, setVp] = useState({ w: 1280, h: 800, ready: false });
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight, ready: true });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

export function useClock(timeZone: string) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  if (!now) return { label: "--:--", h: 0, m: 0, s: 0 };
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const h = get("hour") % 24;
  const m = get("minute");
  const s = get("second");
  return { label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`, h, m, s };
}
