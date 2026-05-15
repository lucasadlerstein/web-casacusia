"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Clock, ArrowUpRight, Play, Youtube } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Filamento } from "@/components/ui/Filamento";
import type { Episodio } from "@/lib/content";

type FilterKey = "ultimos" | "destacados" | "ninos" | "ciencia" | "historias";

const EPISODES_PER_FILTER = 4;

const filterConfig: { key: FilterKey; label: string }[] = [
  { key: "ultimos", label: "Últimos" },
  { key: "destacados", label: "Más escuchados" },
  { key: "ninos", label: "Niños" },
  { key: "ciencia", label: "Ciencia" },
  { key: "historias", label: "Historias" },
];

const NINOS_KEYWORDS = /\b(niñ|hijo|hija|infant|pediátr|familia|mamá|madre|padre|papá|escuela|adolescen|chic|bebé|nacido|nació)\b/i;

function matchesFilter(ep: Episodio, filter: FilterKey): boolean {
  switch (filter) {
    case "ultimos": return true;
    case "destacados": return ep.destacado === true;
    case "ninos": return NINOS_KEYWORDS.test(ep.titulo + " " + ep.descripcion);
    case "ciencia": return ep.categoria === "salud" || ep.categoria === "tecnologia";
    case "historias": return ep.categoria === "historias";
  }
}

function getYoutubeThumbnail(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
}

const categoryColors: Record<string, { accent: string; gradient: string }> = {
  bienestar:  { accent: "bg-verde", gradient: "from-verde/80 to-verde-dark/90" },
  salud:      { accent: "bg-violeta", gradient: "from-violeta/80 to-violeta-dark/90" },
  historias:  { accent: "bg-rosa", gradient: "from-rosa/80 to-rosa-dark/90" },
  tecnologia: { accent: "bg-amarillo", gradient: "from-amarillo/80 to-[#B8860B]/90" },
  derechos:   { accent: "bg-[#563AB3]", gradient: "from-[#563AB3]/80 to-[#3E2899]/90" },
  tips:       { accent: "bg-[#00B980]", gradient: "from-[#00B980]/80 to-[#0E8C57]/90" },
  default:    { accent: "bg-ink", gradient: "from-ink/70 to-ink/90" },
};

interface Props {
  episodios: Episodio[];
}

export function PodcastDestacado({ episodios }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ultimos");

  const availableFilters = useMemo(() => {
    return filterConfig.filter(({ key }) => {
      if (key === "ultimos") return true;
      return episodios.some((ep) => matchesFilter(ep, key));
    });
  }, [episodios]);

  const filtered = useMemo(() => {
    return episodios
      .filter((ep) => matchesFilter(ep, activeFilter))
      .slice(0, EPISODES_PER_FILTER);
  }, [episodios, activeFilter]);

  return (
    <Section background="warm" ariaLabelledBy="podcast-title" className="relative overflow-hidden">
      <Filamento name="rosa" className="top-[-40px] right-[-60px] w-48 rotate-[20deg]" opacity={12} />
      <Filamento name="morado" className="bottom-[-40px] left-[-40px] w-40 rotate-[-15deg]" opacity={10} />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
        <div>
          {/* Header */}
          <div className="mb-8">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-rosa mb-4">
              Sordo pero no mudo
            </p>
            <h2 id="podcast-title" className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink">
              Nuestro podcast
            </h2>
            <p className="mt-4 text-lg text-ink-soft leading-relaxed max-w-xl">
              Conversaciones, identificación y aprendizaje sobre hipoacusia. Escuchalo con transcripción completa.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filtrar episodios">
            {availableFilters.map(({ key, label }) => {
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#143642] text-white shadow-md"
                      : "bg-surface-line text-ink-soft hover:bg-[#143642]/10 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Episode grid */}
          <ul className="grid gap-4 md:gap-5 sm:grid-cols-2">
            {filtered.map((ep) => {
              const colors = categoryColors[ep.categoria] ?? categoryColors.default!;
              const thumbnail = ep.youtubeId ? getYoutubeThumbnail(ep.youtubeId) : null;
              const youtubeUrl = ep.youtubeId ? `https://www.youtube.com/watch?v=${ep.youtubeId}` : null;

              return (
                <li key={ep.slug}>
                  <a
                    href={youtubeUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    {thumbnail && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={thumbnail}
                          alt={`Episodio ${ep.numero}: ${ep.titulo}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="h-12 w-12 rounded-full bg-[#FF0000] flex items-center justify-center shadow-lg">
                            <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                        <div className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${colors.accent}`}>
                          Ep. {ep.numero}
                        </div>
                        {/* YouTube badge */}
                        <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 flex items-center gap-1">
                          <Youtube size={12} className="text-[#FF0000]" />
                          <span className="text-[10px] font-semibold text-white">YouTube</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-verde-dark transition-colors">
                        {ep.titulo}
                      </h3>
                      {ep.invitado && (
                        <p className="mt-1 text-xs text-ink-muted">con {ep.invitado.nombre}</p>
                      )}
                      <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4 text-[11px] text-ink-muted">
                        <span className="inline-flex items-center gap-1"><Clock size={12} />{ep.duracion}</span>
                      </p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <a
              href="https://www.youtube.com/@hipoacusico"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#143642] bg-transparent px-6 py-3 text-sm font-bold text-ink transition-all hover:bg-[#143642] hover:text-white"
            >
              Ver todos en YouTube <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block sticky top-24">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/brand/podcast/spnm-alta.jpg"
              alt="Sordo pero no mudo — Podcast de CASACUSIA"
              width={340}
              height={340}
              className="w-full object-cover"
            />
          </div>
          <div className="mt-5 rounded-2xl bg-white shadow-sm p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Escuchalo en
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="https://www.youtube.com/@hipoacusico" target="_blank" rel="noopener noreferrer" className="rounded-full bg-surface-tint px-3 py-1.5 text-xs font-semibold text-ink hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-colors">
                YouTube
              </a>
              <a href="https://open.spotify.com/show/6zYhA2pOjN0pxW2XcC8eM5" target="_blank" rel="noopener noreferrer" className="rounded-full bg-surface-tint px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-[#1DB954] hover:text-white hover:border-[#1DB954] transition-colors">
                Spotify
              </a>
              <a href="https://podcasts.apple.com/us/podcast/sordo-pero-no-mudo-hablando-desde-mi-hipoacusia/id1695485167" target="_blank" rel="noopener noreferrer" className="rounded-full bg-surface-tint px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-[#872ec4] hover:text-white hover:border-[#872ec4] transition-colors">
                Apple Podcasts
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
