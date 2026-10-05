import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, Youtube, Headphones, Clock, Eye } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { AliadosAuditivos } from "@/components/sections/AliadosAuditivos";
import { Link } from "@/lib/i18n/navigation";
import { getRutasDeEscucha, getRutaBySlug } from "@/lib/content";
import { getPodcastEpisodesByNumero } from "@/lib/podcast";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const SPOTIFY_SHOW = "https://open.spotify.com/show/6zYhA2pOjN0pxW2XcC8eM5";

export async function generateStaticParams() {
  return getRutasDeEscucha().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const ruta = getRutaBySlug(slug);
  if (!ruta) return {};
  return buildMetadata({
    title: `${ruta.titulo} · Rutas de escucha · Sordo pero no mudo`,
    description: ruta.descripcion.slice(0, 160),
    path: `/podcast/rutas/${ruta.slug}`,
    locale: locale as Locale
  });
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString("es-AR");
}

export default async function RutaPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "podcast.rutas" });
  const ruta = getRutaBySlug(slug);
  if (!ruta) notFound();

  const episodios = await getPodcastEpisodesByNumero(ruta.episodios);

  return (
    <main className="bg-surface-bg">
      <section className="pt-14 pb-8 md:pt-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Link
            href="/podcast/rutas"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4 mb-8"
          >
            <ArrowLeft size={16} aria-hidden /> {t("volverRutas")}
          </Link>

          <span className="text-4xl mb-4 block" aria-hidden>{ruta.emoji}</span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink">
            {ruta.titulo}
          </h1>
          <p className="mt-4 text-base md:text-lg text-ink-soft leading-relaxed max-w-3xl">
            {ruta.descripcion}
          </p>
          <p className="mt-3 text-sm font-bold text-ink-muted">
            {episodios.length} {t("episodios")}
          </p>
        </div>
      </section>

      <Section background="default" className="pb-20 pt-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {episodios.map((ep, i) => (
            <article
              key={ep.guid}
              className="rounded-2xl bg-surface-card border border-surface-line overflow-hidden"
            >
              {/* Video embebido */}
              {ep.youtubeId && (
                <div className="relative aspect-video w-full bg-ink">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ep.youtubeId}`}
                    title={ep.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading={i < 2 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              )}

              <div className="p-5 md:p-7">
                <div className="flex items-center gap-3 text-xs text-ink-muted mb-2">
                  <span className="inline-flex items-center rounded-full bg-surface-tint px-2.5 py-0.5 font-bold uppercase tracking-wider">
                    {i + 1} de {episodios.length}
                  </span>
                  {ep.numero != null && (
                    <span>Episodio #{ep.numero}</span>
                  )}
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

                <Link href={`/podcast/${ep.slug}`}>
                  <h2 className="font-display text-lg md:text-xl font-extrabold text-ink leading-snug hover:text-verde-dark transition-colors">
                    {ep.titulo}
                  </h2>
                </Link>

                {ep.descripcion && (
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-3">
                    {ep.descripcion}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {ep.youtubeId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${ep.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-surface-line bg-surface-bg text-ink px-4 py-2 text-xs font-bold hover:border-verde-dark transition-colors"
                    >
                      <Youtube size={14} aria-hidden /> {t("verEnYoutube")}
                    </a>
                  )}
                  <a
                    href={SPOTIFY_SHOW}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-surface-line bg-surface-bg text-ink px-4 py-2 text-xs font-bold hover:border-verde-dark transition-colors"
                  >
                    <Headphones size={14} aria-hidden /> {t("escucharEnSpotify")}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <AliadosAuditivos />
    </main>
  );
}
