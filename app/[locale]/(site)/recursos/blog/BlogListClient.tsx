"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Link } from "@/lib/i18n/navigation";
import type { BlogPost, BlogEtiqueta, blogEtiquetas } from "@/lib/content";

type Labels = {
  buscar: string;
  todas: string;
  leerMas: string;
  sinResultados: string;
  sinResultadosDesc: string;
  por: string;
  etiquetas: Record<BlogEtiqueta, string>;
};

type Props = {
  posts: BlogPost[];
  labels: Labels;
};

const ALL_TAGS: BlogEtiqueta[] = [
  "historias",
  "familias",
  "tecnologia",
  "comunidad",
  "informacion",
  "podcast"
];

function formatDate(fecha: string): string {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

export function BlogListClient({ posts, labels }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<BlogEtiqueta | null>(null);

  const filtered = useMemo(() => {
    let result = posts;

    if (activeTag) {
      result = result.filter((p) => p.etiquetas.includes(activeTag));
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.titulo.toLowerCase().includes(q) ||
          p.resumen.toLowerCase().includes(q) ||
          p.contenido.toLowerCase().includes(q) ||
          p.autor.toLowerCase().includes(q) ||
          p.etiquetas.some((e) => e.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, query, activeTag]);

  // Solo mostrar etiquetas que tienen al menos 1 post
  const activeTags = useMemo(() => {
    return ALL_TAGS.filter((tag) => posts.some((p) => p.etiquetas.includes(tag)));
  }, [posts]);

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="relative max-w-xl mb-8">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.buscar}
          className="w-full rounded-xl border border-surface-line bg-surface-card pl-11 pr-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-verde/40 focus:border-verde transition-colors"
        />
      </div>

      {/* Filtros por etiqueta */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filtrar por etiqueta">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTag === null
                ? "bg-verde-dark text-white"
                : "bg-surface-tint text-ink-soft hover:bg-surface-line hover:text-ink"
            }`}
          >
            {labels.todas}
          </button>
          {activeTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTag === tag
                  ? "bg-verde-dark text-white"
                  : "bg-surface-tint text-ink-soft hover:bg-surface-line hover:text-ink"
              }`}
            >
              {labels.etiquetas[tag]}
            </button>
          ))}
        </div>
      )}

      {/* Grid de posts */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/recursos/blog/${post.slug}`} className="group">
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                {/* Etiquetas */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.etiquetas.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-verde-soft px-2.5 py-0.5 text-xs font-semibold text-verde-dark"
                    >
                      {labels.etiquetas[tag]}
                    </span>
                  ))}
                </div>

                <h2 className="font-display text-lg font-extrabold text-ink leading-snug group-hover:text-verde-dark transition-colors">
                  {post.titulo}
                </h2>

                <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-3 flex-1">
                  {post.resumen}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
                  <span>
                    {post.episodio?.numero != null
                      ? `Del episodio ${post.episodio.numero} · ${formatDate(post.fecha)}`
                      : `${labels.por} ${post.autor} · ${formatDate(post.fecha)}`}
                  </span>
                  <span className="font-bold text-verde-dark group-hover:underline">
                    {labels.leerMas} &rarr;
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-bold text-ink">{labels.sinResultados}</p>
          <p className="mt-2 text-ink-soft">{labels.sinResultadosDesc}</p>
        </div>
      )}
    </div>
  );
}
