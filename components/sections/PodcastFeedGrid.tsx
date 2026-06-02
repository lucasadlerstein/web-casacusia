"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Play, Clock } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import type { PodcastEpisode } from "@/lib/podcast";

const PAGE_SIZE = 18;

function formatDate(pubDate: string): string {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}

export function PodcastFeedGrid({ episodios }: { episodios: PodcastEpisode[] }) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return episodios;
    return episodios.filter(
      (e) =>
        e.titulo.toLowerCase().includes(q) ||
        e.descripcion.toLowerCase().includes(q) ||
        (e.numero != null && `${e.numero}`.includes(q))
    );
  }, [episodios, query]);

  const shown = filtered.slice(0, visible);

  return (
    <div>
      <div className="relative max-w-md mb-8">
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
                <div className="relative aspect-square overflow-hidden bg-surface-tint">
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
