"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#aca0fc", "#dcf34a", "#ff5a1f", "#aca0fc", "#dcf34a"];

type Blob = { x: number; y: number; r: number; vx: number; vy: number; c: string; life: number };

/**
 * Manchete em canvas: letras claras preenchidas por manchas de cor orgânicas
 * que derivam sozinhas e são "pintadas" por onde o cursor passa.
 */
export default function HeroMural({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const box = wrap.current!;
    const ctx = el.getContext("2d")!;
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d")!;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let blobs: Blob[] = [];
    const pointer = { x: -9999, y: -9999, active: false, last: 0 };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "sans-serif";

    function layout() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.clientWidth;
      // telas estreitas: quebra a manchete em duas linhas
      const words = text.split(" ");
      const lines =
        w < 640 && words.length > 1
          ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")]
          : [text];
      // mede cada linha para que ocupe a largura toda
      const metrics = lines.map((line) => {
        mctx.font = `700 100px ${fontFamily}`;
        mctx.letterSpacing = "-4px";
        const m = mctx.measureText(line);
        const size = (100 * w) / (m.width || 1);
        return {
          line,
          size: Math.min(size, lines.length > 1 ? w * 0.36 : size),
          asc: m.actualBoundingBoxAscent / 100,
          desc: m.actualBoundingBoxDescent / 100,
        };
      });
      const gap = (metrics[0]?.size ?? 0) * 0.06;
      h = Math.ceil(metrics.reduce((s, m) => s + (m.asc + m.desc) * m.size, 0) + gap * (lines.length - 1) + 4);
      box.style.height = `${h}px`;
      for (const c of [el, mask]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.clearRect(0, 0, w, h);
      mctx.fillStyle = "#fff";
      mctx.textBaseline = "alphabetic";
      let y = 0;
      for (const m of metrics) {
        mctx.font = `700 ${m.size}px ${fontFamily}`;
        mctx.letterSpacing = `${-0.04 * m.size}px`;
        const mw = mctx.measureText(m.line).width;
        const scale = Math.min(1.15, w / (mw || 1));
        y += m.asc * m.size;
        mctx.save();
        mctx.scale(scale, 1);
        mctx.fillText(m.line, 0, y + 1);
        mctx.restore();
        y += m.desc * m.size + gap;
      }
      seed();
    }

    function seed() {
      blobs = [];
      const n = Math.round(w / 90);
      for (let i = 0; i < n; i++) {
        blobs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: h * (0.25 + Math.random() * 0.35),
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.25,
          c: COLORS[i % COLORS.length],
          life: Infinity,
        });
      }
    }

    function frame(t: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(242,243,243,0.9)";
      ctx.fillRect(0, 0, w, h);

      for (const b of blobs) {
        if (!reduce) {
          b.x += b.vx + Math.sin(t / 2400 + b.r) * 0.15;
          b.y += b.vy + Math.cos(t / 2100 + b.r) * 0.12;
        }
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;
        if (b.life !== Infinity) {
          b.life -= 1;
          b.r *= 0.996;
        }
        // mancha orgânica: círculo deformado
        ctx.fillStyle = b.c;
        ctx.beginPath();
        const k = 9;
        for (let i = 0; i <= k; i++) {
          const a = (i / k) * Math.PI * 2;
          const wob = 1 + Math.sin(a * 3 + t / 900 + b.r) * 0.08;
          const px = b.x + Math.cos(a) * b.r * wob;
          const py = b.y + Math.sin(a) * b.r * wob;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      }
      blobs = blobs.filter((b) => b.life > 0);

      // recorta tudo pelo formato das letras
      ctx.globalCompositeOperation = "destination-in";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(mask, 0, 0);
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      const now = performance.now();
      if (now - pointer.last < 40) return;
      pointer.last = now;
      blobs.push({
        x,
        y,
        r: h * (0.12 + Math.random() * 0.12),
        vx: (x - pointer.x) * 0.01 || 0,
        vy: (y - pointer.y) * 0.01 || 0,
        c: COLORS[Math.floor(Math.random() * 3)],
        life: 260,
      });
      pointer.x = x;
      pointer.y = y;
      if (blobs.length > 120) blobs.splice(Math.round(w / 90), 1);
    }

    const ro = new ResizeObserver(() => layout());
    ro.observe(box);
    document.fonts?.load(`700 100px ${fontFamily}`).then(layout).catch(() => {});
    document.fonts?.ready.then(layout);
    layout();
    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [text]);

  return (
    <div ref={wrap} className="relative w-full" aria-label={text} role="img">
      <canvas ref={canvas} className="absolute inset-0" />
    </div>
  );
}
