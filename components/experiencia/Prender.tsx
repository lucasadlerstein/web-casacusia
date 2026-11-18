"use client";

import { useEffect, useRef } from "react";

/**
 * La luz que se prende: un velo oscuro sobre la sección que titila y se va
 * la primera vez que la sección entra en pantalla. Sin JS no hay velo: la
 * sección se ve iluminada desde el principio.
 */
export function Prender() {
  const velo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = velo.current;
    const seccion = el?.closest("section");
    if (!el || !seccion) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // El velo arranca invisible: si el observador nunca dispara, la sección
    // igual se ve. Al entrar en pantalla, la animación lo prende y lo apaga.
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        el.classList.add("animate-exp-prender");
        obs.disconnect();
      },
      { rootMargin: "-15% 0px -15% 0px", threshold: 0 }
    );
    obs.observe(seccion);
    return () => obs.disconnect();
  }, []);

  return <div ref={velo} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-exp-noche opacity-0" />;
}
