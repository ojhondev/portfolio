"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Vídeo discreto atrás da manchete e um pouco atrás das pastas.
 * O blur da parte de baixo já vem "assado" no arquivo (ffmpeg), então aqui
 * só há véu + gradiente — nada de backdrop-filter, que pesava a cada quadro.
 */
export default function BackgroundVideo({ height, hidden }: { height: number; hidden: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  // toca só quando visível; pausa com pasta/livro aberto, aba oculta ou "reduzir movimento"
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sync = () => {
      if (reduce || hidden || document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [hidden]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden"
      style={{ height }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster="/bg/code-poster.jpg"
      >
        <source src="/bg/code.webm" type="video/webm" />
        <source src="/bg/code.mp4" type="video/mp4" />
      </video>
      {/* véu escuro (no tema claro, véu da cor do papel) */}
      <div className="absolute inset-0" style={{ background: "color-mix(in srgb, var(--bg) var(--video-veil), transparent)" }} />
      {/* gradiente final para a cor da página, emendando nas pastas */}
      <div className="absolute inset-x-0 bottom-0 h-[55%]" style={{ background: "linear-gradient(to bottom, transparent, var(--bg) 92%)" }} />
    </motion.div>
  );
}
