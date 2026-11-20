"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, PlayCircle, Video, type LucideIcon } from "lucide-react";

import type { AlaParContent } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import { calendarUrl } from "./webinar";

type Webinar = AlaParContent["webinar"];

type Boton = { href: string; label: string; icon: LucideIcon };

/**
 * Aviso de la charla informativa para futuros Pares.
 * Pasada la hora de fin muestra la grabación, o se oculta si no hay
 * (chequeo en el cliente, para que no dependa de cuándo se hizo el último deploy).
 */
export function WebinarAviso({
  webinar,
  className,
  variant = "tarjeta"
}: {
  webinar: Webinar;
  className?: string;
  /** "tarjeta": dentro de una columna. "banda": franja a todo el ancho debajo del hero. */
  variant?: "tarjeta" | "banda";
}) {
  const [pasado, setPasado] = useState(() => Date.now() > new Date(webinar.fin).getTime());
  useEffect(() => {
    setPasado(Date.now() > new Date(webinar.fin).getTime());
  }, [webinar.fin]);

  const { grabacion } = webinar;
  if (pasado && !grabacion) return null;

  const etiqueta = pasado && grabacion ? grabacion.etiqueta : webinar.etiqueta;
  const texto = pasado && grabacion ? grabacion.texto : webinar.texto;
  const [principal, secundario]: (Boton | undefined)[] =
    pasado && grabacion
      ? [{ href: grabacion.url, label: grabacion.cta, icon: PlayCircle }]
      : [
          { href: webinar.meet, label: webinar.ctaMeet, icon: Video },
          { href: calendarUrl(webinar), label: webinar.ctaAgendar, icon: CalendarPlus }
        ];

  if (variant === "banda") {
    return (
      <section aria-label={etiqueta} className={cn("bg-alapar-ambar", className)}>
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:py-7">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-alapar-cereza-deep">{etiqueta}</p>
            <p className="mt-1 font-onest text-xl font-extrabold leading-tight text-alapar-cereza-deep md:text-2xl">{webinar.titulo}</p>
            <p className="mt-1.5 text-base leading-relaxed text-alapar-cereza-deep/90">{texto}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {principal && (
              <a
                href={principal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-alapar-cereza px-5 text-sm font-bold text-alapar-crema transition-colors hover:bg-alapar-cereza-deep md:text-base"
              >
                <principal.icon size={18} aria-hidden="true" />
                {principal.label}
              </a>
            )}
            {secundario && (
              <a
                href={secundario.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-alapar-cereza bg-white/60 px-5 text-sm font-bold text-alapar-cereza transition-colors hover:bg-white md:text-base"
              >
                <secundario.icon size={18} aria-hidden="true" />
                {secundario.label}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <aside
      aria-label={etiqueta}
      className={cn(
        "rounded-2xl border border-alapar-ambar bg-alapar-ambar-soft p-5 shadow-[0_18px_40px_-30px_rgba(234,89,33,0.6)]",
        className
      )}
    >
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-alapar-cereza">{etiqueta}</p>
      <p className="mt-1.5 font-onest text-lg font-extrabold leading-tight text-ink md:text-xl">{webinar.titulo}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">{texto}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {principal && (
          <a
            href={principal.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-alapar-cereza px-4 text-sm font-bold text-alapar-crema transition-colors hover:bg-alapar-cereza-deep"
          >
            <principal.icon size={16} aria-hidden="true" />
            {principal.label}
          </a>
        )}
        {secundario && (
          <a
            href={secundario.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-alapar-cereza/40 bg-white px-4 text-sm font-bold text-alapar-cereza transition-colors hover:border-alapar-cereza"
          >
            <secundario.icon size={16} aria-hidden="true" />
            {secundario.label}
          </a>
        )}
      </div>
    </aside>
  );
}
