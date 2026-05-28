import { MessageCircle, MapPin, Globe, Users, ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { getGruposWhatsapp } from "@/lib/content";

export function GruposWhatsapp() {
  const data = getGruposWhatsapp();

  return (
    <Section background="tint" className="py-14">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink">
            Elegí tu grupo
          </h2>
          <p className="text-sm font-semibold text-verde-dark">
            +{data.totalPersonas.toLocaleString("es-AR")} personas en la comunidad
          </p>
        </div>
        <p className="text-ink-soft mb-8">
          Sumate al que mejor te represente. Podés estar en todos los que quieras.
        </p>

        {/* Argentina — desplegable */}
        <details className="group rounded-2xl bg-surface-card border border-surface-line overflow-hidden mb-4" open>
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-surface-bg transition-colors">
            <span className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <MapPin size={20} aria-hidden className="text-verde-dark" />
              Argentina
              <span className="text-sm font-semibold text-ink-muted">({data.grupos.length})</span>
            </span>
            <span aria-hidden className="font-display text-2xl leading-none text-verde-dark transition-transform group-open:rotate-45 shrink-0">
              +
            </span>
          </summary>
          <div className="px-5 md:px-6 pb-6">
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {data.grupos.map((g) => (
                <li key={g.nombre}>
                  <GrupoLink nombre={g.nombre} href={data.linkComunidad} />
                </li>
              ))}
            </ul>
          </div>
        </details>

        {/* Internacionales */}
        <div className="rounded-2xl bg-surface-card border border-surface-line p-5 md:p-6 mb-4">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink mb-4">
            <Globe size={20} aria-hidden className="text-violeta-dark" />
            Otros países
          </h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.gruposInternacionales.map((g) => (
              <li key={g.nombre}>
                <GrupoLink nombre={g.nombre} bandera={g.bandera} href={data.linkComunidad} />
              </li>
            ))}
          </ul>
        </div>

        {/* Temáticos */}
        <div className="rounded-2xl bg-surface-card border border-surface-line p-5 md:p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink mb-4">
            <Users size={20} aria-hidden className="text-rosa-dark" />
            Por tema o etapa
          </h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.gruposTematicos.map((g) => (
              <li key={g.nombre}>
                <GrupoLink nombre={g.nombre} href={data.linkComunidad} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-2xl bg-verde-soft border border-verde-dark/20 p-5 md:p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-verde-dark text-white">
            <MessageCircle size={20} aria-hidden />
          </span>
          <p className="flex-1 text-sm md:text-base text-ink leading-relaxed">
            Todos los grupos se abren desde el mismo lugar: entrá al link y tocá <strong>“Comunidad de WhatsApp”</strong> para ver y unirte a los que quieras.
          </p>
          <a
            href={data.linkComunidad}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-verde-dark text-white hover:bg-[#0a6b42] transition-colors px-5 py-3 text-sm font-bold shrink-0"
          >
            Abrir comunidad
            <ArrowRight size={14} aria-hidden />
          </a>
        </div>
      </div>
    </Section>
  );
}

function GrupoLink({ nombre, bandera, href }: { nombre: string; bandera?: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 rounded-xl bg-surface-bg border border-surface-line px-3 py-2.5 text-sm font-semibold text-ink hover:border-verde-dark hover:bg-verde-soft/40 transition-colors"
    >
      {bandera ? (
        <span aria-hidden className="text-base leading-none shrink-0">{bandera}</span>
      ) : (
        <MessageCircle size={14} aria-hidden className="text-verde-dark shrink-0" />
      )}
      <span className="truncate">{nombre}</span>
    </a>
  );
}
