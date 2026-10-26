"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Video } from "lucide-react";

import type { AlaParContent } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

type Webinar = AlaParContent["webinar"];

/** Fecha ISO → formato compacto de Google Calendar (20261119T220000Z). */
function gcalDate(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function calendarUrl(w: Webinar): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: w.calendarTitulo,
    dates: `${gcalDate(w.inicio)}/${gcalDate(w.fin)}`,
    details: w.calendarDetalle,
    location: w.meet,
    ctz: "America/Argentina/Buenos_Aires"
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Aviso de la charla informativa para futuros Pares.
 * Se oculta solo una vez pasada la hora de fin (chequeo en el cliente, para
 * que no dependa de cuándo se hizo el último deploy).
 */
export function WebinarAviso({ webinar, className }: { webinar: Webinar; className?: string }) {
  const [pasado, setPasado] = useState(false);
  useEffect(() => {
    setPasado(Date.now() > new Date(webinar.fin).getTime());
  }, [webinar.fin]);

  if (pasado) return null;

  return (
    <aside
      aria-label={webinar.etiqueta}
      className={cn(
        "rounded-2xl border border-alapar-ambar bg-alapar-ambar-soft p-5 shadow-[0_18px_40px_-30px_rgba(234,89,33,0.6)]",
        className
      )}
    >
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-alapar-cereza">{webinar.etiqueta}</p>
      <p className="mt-1.5 font-onest text-lg font-extrabold leading-tight text-ink md:text-xl">{webinar.titulo}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">{webinar.texto}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={webinar.meet}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-alapar-cereza px-4 text-sm font-bold text-alapar-crema transition-colors hover:bg-alapar-cereza-deep"
        >
          <Video size={16} aria-hidden="true" />
          {webinar.ctaMeet}
        </a>
        <a
          href={calendarUrl(webinar)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-alapar-cereza/40 bg-white px-4 text-sm font-bold text-alapar-cereza transition-colors hover:border-alapar-cereza"
        >
          <CalendarPlus size={16} aria-hidden="true" />
          {webinar.ctaAgendar}
        </a>
      </div>
    </aside>
  );
}
