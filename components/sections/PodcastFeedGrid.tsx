"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Play, Clock, Eye, TrendingUp, CalendarDays } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import type { PodcastEpisode, PodcastCategoria } from "@/lib/podcast";
import { PODCAST_CATEGORIAS } from "@/lib/podcast";

const PAGE_SIZE = 18;

type SortMode = "recientes" | "populares";

const CAT_TABS: { key: PodcastCategoria | "todos"; label: string }[] = [
  { key: "todos",      label: "Todos" },
  { key: "historias",   label: "Historias" },
  { key: "patologias",  label: "Patologías" },
  { key: "tecnicos",    label: "Técnicos" },
  { key: "familiares",  label: "Familiares" }
];

function formatDate(pubDate: string): string {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString("es-AR");
}

export function PodcastFeedGrid({
  episodios,
  categoriaInicial
}: {
  episodios: PodcastEpisode[];
  categoriaInicial?: PodcastCategoria;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("recientes");
  const [cat, setCat] = useState<PodcastCategoria | "todos">(categoriaInicial ?? "todos");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const sorted = useMemo(() => {
    if (sort === "populares") {
      return [...episodios].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }
    return episodios;
  }, [episodios, sort]);

  const filtered = useMemo(() => {
    let list = sorted;
    if (cat !== "todos") {
      list = list.filter((e) => e.categoria === cat);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.titulo.toLowerCase().includes(q) ||
          e.descripcion.toLowerCase().includes(q) ||
          (e.numero != null && `${e.numero}`.includes(q))
      );
    }
    return list;
  }, [sorted, query, cat]);

  const shown = filtered.slice(0, visible);

  return (
    <div>
      {/* Categorías */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filtrar por categoría">
        {CAT_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={cat === tab.key}
            onClick={() => { setCat(tab.key); setVisible(PAGE_SIZE); }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              cat === tab.key
                ? "bg-ink text-white"
                : "bg-surface-card border border-surface-line text-ink-soft hover:border-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Controles: búsqueda + orden */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search size={18} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
            placeholder="Buscar episodio…"
            aria-label="Buscar episodio"
            className="w-full rounded-full border border-surface-line bg-surface-card pl-11 pr-4 py-3 text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-verde-dark"
          />
        </div>
        <div className="flex gap-2" role="tablist" aria-label="Ordenar episodios">
          <button
            type="button"
            role="tab"
            aria-selected={sort === "recientes"}
            onClick={() => { setSort("recientes"); setVisible(PAGE_SIZE); }}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              sort === "recientes"
                ? "bg-verde-dark text-white"
                : "bg-surface-card border border-surface-line text-ink-soft hover:border-verde-dark"
            }`}
          >
            <CalendarDays size={14} aria-hidden />
            Más recientes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sort === "populares"}
            onClick={() => { setSort("populares"); setVisible(PAGE_SIZE); }}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              sort === "populares"
                ? "bg-verde-dark text-white"
                : "bg-surface-card border border-surface-line text-ink-soft hover:border-verde-dark"
            }`}
          >
            <TrendingUp size={14} aria-hidden />
            Más escuchados
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="text-ink-soft">No encontramos episodios con ese término.</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((ep) => (
            <li key={ep.guid}>
              <Link
                href={`/podcast/${ep.slug}`}
                className="group flex flex-col h-full rounded-2xl bg-surface-card border border-surface-line overflow-hidden hover:border-verde-dark hover:shadow-md transition-all"
              >
                <div className={`relative ${ep.aspecto === "16:9" ? "aspect-video" : "aspect-square"} overflow-hidden bg-surface-tint`}>
                  {ep.imagen && (
                    <Image
                      src={ep.imagen}
                      alt={ep.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/0 group-hover:bg-ink/30 transition-colors">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-verde-dark opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                      <Play size={24} aria-hidden className="ml-1" />
                    </span>
                  </span>
                  {ep.numero != null && (
                    <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-ink/85 text-white px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
                      #{ep.numero}
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <div className="mb-2">
                    <span className="inline-block rounded-full bg-surface-tint px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                      {PODCAST_CATEGORIAS[ep.categoria]}
                    </span>
                  </div>
                  <h3 className="font-display text-base md:text-lg font-bold text-ink leading-snug line-clamp-2 group-hover:text-verde-dark transition-colors">
                    {ep.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft line-clamp-2 flex-1">{ep.descripcion}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-ink-muted">
                    {ep.pubDate && <span>{formatDate(ep.pubDate)}</span>}
                    {ep.duracion && (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} aria-hidden /> {ep.duracion}
                      </span>
                    )}
                    {ep.views != null && (
                      <span className="inline-flex items-center gap-1">
                        <Eye size={12} aria-hidden /> {formatViews(ep.views)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {visible < filtered.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-3 text-sm font-bold hover:bg-ink-soft transition-colors"
          >
            Ver más episodios ({filtered.length - visible})
          </button>
        </div>
      )}
    </div>
  );
}
