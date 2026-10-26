"use client";

import { useEffect, useRef } from "react";
import { CalendarPlus, Video, X } from "lucide-react";

import type { AlaParContent } from "@/lib/content";
import { calendarUrl } from "./webinar";

type Webinar = AlaParContent["webinar"];

const STORAGE_KEY = "alapar-webinar-visto";

function yaVisto(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function marcarVisto() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* sin storage: el modal puede volver a aparecer en la próxima carga */
  }
}

/**
 * Modal de la charla informativa para futuros Pares.
 * - Se abre a los `delayMs` de llegar, una sola vez por sesión.
 * - Si en ese momento hay otro <dialog> abierto (ej. "Quiero acompañamiento"), no aparece.
 * - No aparece una vez pasada la charla.
 */
export function WebinarModal({ webinar }: { webinar: Webinar }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (Date.now() > new Date(webinar.fin).getTime() || yaVisto()) return;

    const timeout = setTimeout(() => {
      const el = ref.current;
      // Si la persona está en el modal de "Quiero acompañamiento", vino a pedir
      // acompañamiento: no le ofrecemos la charla para ser Par.
      if (!el || el.open || document.querySelector("dialog[open]")) return;
      el.showModal();
      marcarVisto();
    }, webinar.delayMs);

    return () => clearTimeout(timeout);
  }, [webinar.fin, webinar.delayMs]);

  const cerrar = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrar();
      }}
      aria-labelledby="alapar-webinar-titulo"
      className="m-auto w-[min(92vw,30rem)] overflow-hidden rounded-[2rem] bg-alapar-crema p-0 text-ink shadow-[0_40px_90px_-30px_rgba(110,19,53,0.6)] backdrop:bg-alapar-cereza-deep/70 backdrop:backdrop-blur-sm open:animate-[alapar-rise_300ms_var(--ease-out)_both]"
    >
      <div className="relative bg-alapar-ambar px-6 pb-5 pt-6 sm:px-8">
        <button
          type="button"
          onClick={cerrar}
          aria-label={webinar.cerrar}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-alapar-cereza-deep transition-colors hover:bg-white/40"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-alapar-cereza-deep">{webinar.etiqueta}</p>
        <h2 id="alapar-webinar-titulo" className="mt-2 pr-10 font-onest text-2xl font-extrabold leading-tight text-alapar-cereza-deep sm:text-[1.9rem]">
          {webinar.titulo}
        </h2>
      </div>

      <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
        <p className="text-base leading-relaxed text-ink-soft md:text-lg">{webinar.texto}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={webinar.meet}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-alapar-cereza px-6 font-onest font-extrabold text-alapar-crema transition-colors hover:bg-alapar-cereza-deep"
          >
            <Video size={18} aria-hidden="true" />
            {webinar.ctaMeet}
          </a>
          <a
            href={calendarUrl(webinar)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-alapar-cereza px-6 font-onest font-extrabold text-alapar-cereza transition-colors hover:bg-alapar-cereza hover:text-alapar-crema"
          >
            <CalendarPlus size={18} aria-hidden="true" />
            {webinar.ctaAgendar}
          </a>
        </div>
        <button
          type="button"
          onClick={cerrar}
          className="mt-4 text-sm font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {webinar.cerrar}
        </button>
      </div>
    </dialog>
  );
}
