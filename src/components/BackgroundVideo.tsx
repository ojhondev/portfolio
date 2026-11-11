"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Vídeo discreto atrás da manchete e um pouco atrás das pastas:
 * véu escuro por cima e, na parte de baixo, blur progressivo + gradiente
 * para a cor da página, fazendo a transição suave até as pastas.
 */
export default function BackgroundVideo({ height, hidden }: { height: number; hidden: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // respeita quem prefere menos movimento: fica só o poster
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
  }, []);

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
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/bg/code-poster.jpg"
      >
        <source src="/bg/code.webm" type="video/webm" />
        <source src="/bg/code.mp4" type="video/mp4" />
      </video>
      {/* véu escuro (no tema claro, véu da cor do papel) */}
      <div className="absolute inset-0" style={{ background: "color-mix(in srgb, var(--bg) var(--video-veil), transparent)" }} />
      {/* blur progressivo na metade de baixo */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          maskImage: "linear-gradient(to bottom, transparent, black 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 70%)",
        }}
      />
      {/* gradiente final para a cor da página, emendando nas pastas */}
      <div className="absolute inset-x-0 bottom-0 h-[55%]" style={{ background: "linear-gradient(to bottom, transparent, var(--bg) 92%)" }} />
    </motion.div>
  );
}
