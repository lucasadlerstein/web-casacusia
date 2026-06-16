"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { Clock, ArrowUpRight, Play, ChevronLeft, ChevronRight, Eye } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import type { PodcastEpisode } from "@/lib/podcast";

const TOP_COUNT = 9;

const YOUTUBE_CHANNEL = "https://www.youtube.com/@Hipoacusico";
const SPOTIFY_SHOW = "https://open.spotify.com/show/6zYhA2pOjN0pxW2XcC8eM5";
const APPLE = "https://podcasts.apple.com/us/podcast/sordo-pero-no-mudo-hablando-desde-mi-hipoacusia/id1695485167";

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString("es-AR");
}

interface Props {
  episodios: PodcastEpisode[];
}

export function PodcastDestacado({ episodios }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const topEpisodios = useMemo(
    () => [...episodios].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, TOP_COUNT),
    [episodios]
  );

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("li");
    const w = card ? card.offsetWidth + 20 : 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" });
  }

  return (
    <section className="bg-surface-warm py-16 md:py-20 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-rosa mb-3">
              Sordo pero no mudo
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
              Los más escuchados
            </h2>
            <p className="mt-3 text-base text-ink-soft max-w-lg">
              Más de {episodios.length} episodios con historias reales sobre hipoacusia. Estos son los favoritos de la comunidad.
            </p>
          </div>

          {/* Arrows desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Anterior"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-surface-line bg-white text-ink hover:bg-surface-tint transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Siguiente"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-surface-line bg-white text-ink hover:bg-surface-tint transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <ul className="flex gap-5" role="list">
            {topEpisodios.map((ep, i) => (
              <li
                key={ep.guid}
                className="snap-start shrink-0 w-[280px] sm:w-[300px]"
              >
                <Link
                  href={`/podcast/${ep.slug}`}
                  className="group flex flex-col h-full rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  {ep.imagen && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={ep.imagen}
                        alt={ep.titulo}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="300px"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="h-12 w-12 rounded-full bg-verde-dark flex items-center justify-center shadow-lg">
                          <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 rounded-full bg-ink/85 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white">
                        #{i + 1}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-display text-sm font-bold leading-snug text-ink group-hover:text-verde-dark transition-colors line-clamp-2">
                      {ep.titulo}
                    </h3>
                    <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-3 text-[11px] text-ink-muted">
                      {ep.duracion && (
                        <span className="inline-flex items-center gap-1"><Clock size={12} />{ep.duracion}</span>
                      )}
                      {ep.views != null && (
                        <span className="inline-flex items-center gap-1"><Eye size={12} />{formatViews(ep.views)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA row */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/podcast"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-transparent px-6 py-3 text-sm font-bold text-ink transition-all hover:bg-ink hover:text-white"
          >
            Ver todos los episodios <ArrowUpRight size={16} />
          </Link>
          <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white border border-surface-line px-4 py-2.5 text-xs font-semibold text-ink hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-colors">
            YouTube
          </a>
          <a href={SPOTIFY_SHOW} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white border border-surface-line px-4 py-2.5 text-xs font-semibold text-ink hover:bg-[#1DB954] hover:text-white hover:border-[#1DB954] transition-colors">
            Spotify
          </a>
          <a href={APPLE} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white border border-surface-line px-4 py-2.5 text-xs font-semibold text-ink hover:bg-[#872ec4] hover:text-white hover:border-[#872ec4] transition-colors">
            Apple Podcasts
          </a>
        </div>
      </div>
    </section>
  );
}
