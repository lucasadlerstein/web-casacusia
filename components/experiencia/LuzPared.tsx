"use client";

import { useEffect, useRef, useState } from "react";
import { tonoEstilo } from "./ui";

/**
 * La luz de la pared de post-its. Prendida, la pared se ve entera. Apagada,
 * la sección queda a oscuras y el puntero (o el dedo) es una linterna que
 * revela los post-its a su paso. Arranca prendida: se lee sin hacer nada.
 */
export function LuzPared({ prender, apagar }: { prender: string; apagar: string }) {
  const [encendida, setEncendida] = useState(true);
  const velo = useRef<HTMLDivElement>(null);
  const luz = useRef({ x: 50, y: 40 }); // en % de la sección

  useEffect(() => {
    const el = velo.current;
    const seccion = el?.closest<HTMLElement>("section");
    if (!el || !seccion) return;

    // Las variables de tono viven como estilo en línea (ver Bloque): se pisan ahí.
    const tono = tonoEstilo(encendida ? "luz" : "noche") as Record<string, string>;
    for (const [k, v] of Object.entries(tono)) seccion.style.setProperty(k, v);
    seccion.dataset.luz = encendida ? "prendida" : "apagada";
    if (encendida) return;

    let cuadro = 0;
    const pintar = () => {
      cuadro = 0;
      el.style.background = `radial-gradient(circle 280px at ${luz.current.x}% ${luz.current.y}%, rgb(5 8 10 / 0) 0%, rgb(5 8 10 / 0.35) 45%, rgb(5 8 10 / 0.97) 100%)`;
    };
    const alMover = (e: PointerEvent) => {
      const r = seccion.getBoundingClientRect();
      luz.current = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    };
    pintar();
    seccion.addEventListener("pointermove", alMover, { passive: true });
    seccion.addEventListener("pointerdown", alMover, { passive: true });
    return () => {
      if (cuadro) cancelAnimationFrame(cuadro);
      seccion.removeEventListener("pointermove", alMover);
      seccion.removeEventListener("pointerdown", alMover);
    };
  }, [encendida]);

  return (
    <>
      <div
        ref={velo}
        aria-hidden="true"
        className={
          "pointer-events-none absolute inset-0 z-20 transition-opacity duration-500 " + (encendida ? "opacity-0" : "opacity-100")
        }
      />
      <div className="relative z-30 mt-8 flex justify-end">
        <button
          type="button"
          aria-pressed={!encendida}
          onClick={() => setEncendida((v) => !v)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[color:var(--linea-fuerte)] px-4 font-display text-sm font-bold text-[color:var(--tinta)] transition-colors duration-200 hover:bg-[color:var(--sup)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-amarillo"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.3 1 2.5h6c0-1.2.3-1.9 1-2.5A6 6 0 0 0 12 3z" />
            {encendida && <path d="M12 0.5v1M3.5 4l.8.8M20.5 4l-.8.8M1 10.5h1M22 10.5h1" />}
          </svg>
          {encendida ? apagar : prender}
        </button>
      </div>
    </>
  );
}
