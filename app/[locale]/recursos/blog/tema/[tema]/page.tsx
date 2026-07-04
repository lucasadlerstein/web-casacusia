import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, Headphones, Calendar, Play } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { DonacionCTA } from "@/components/sections/DonacionCTA";
import { Link } from "@/lib/i18n/navigation";
import { getTemas, getTemaBySlug, getBlogPostsByTema, type Tema } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

export function generateStaticParams() {
  return getTemas().map((t) => ({ tema: t.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; tema: string }>;
}): Promise<Metadata> {
  const { locale, tema: slug } = await params;
  const tema = getTemaBySlug(slug);
  if (!tema) return {};
  return buildMetadata({
    title: `${tema.nombre} — CASACUSIA`,
    description: tema.descripcion,
    path: `/recursos/blog/tema/${tema.slug}`,
    locale: locale as Locale
  });
}

function formatDate(fecha: string): string {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function TemaPage({
  params
}: {
  params: Promise<{ locale: string; tema: string }>;
}) {
  const { locale, tema: slug } = await params;
  const tema = getTemaBySlug(slug);
  if (!tema) notFound();
  setRequestLocale(locale);

  const posts = getBlogPostsByTema(tema);
  const allTemas = getTemas();

  // Extraer episodios únicos (max 6)
  const episodiosMap = new Map<string, { slug: string; titulo: string; numero?: number; postCount: number }>();
  for (const p of posts) {
    if (p.episodio) {
      const existing = episodiosMap.get(p.episodio.slug);
      if (existing) {
        existing.postCount++;
      } else {
        episodiosMap.set(p.episodio.slug, {
          slug: p.episodio.slug,
          titulo: p.episodio.titulo,
          numero: p.episodio.numero,
          postCount: 1
        });
      }
    }
  }
  const episodios = [...episodiosMap.values()]
    .sort((a, b) => (b.numero ?? 0) - (a.numero ?? 0))
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tema.nombre} — CASACUSIA`,
    description: tema.descripcion,
    url: `${SITE_URL}/recursos/blog/tema/${tema.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "CASACUSIA",
      url: SITE_URL
    }
  };

  return (
    <main className="bg-surface-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-surface-tint border-b border-surface-line py-16 md:py-24">
        <div className="container max-w-5xl">
          <Link
            href="/recursos/blog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4 mb-6"
          >
            <ArrowLeft size={16} aria-hidden /> Ver todas las notas
          </Link>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-ink">
            {tema.nombre}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-ink-soft leading-relaxed max-w-3xl">
            {tema.descripcion}
          </p>
        </div>
      </section>

      <Section>
        {/* Navegación entre temas */}
        <div className="flex flex-wrap gap-2 mb-10" role="navigation" aria-label="Temas">
          {allTemas.map((t) => (
            <Link
              key={t.slug}
              href={`/recursos/blog/tema/${t.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                t.slug === tema.slug
                  ? "bg-verde-dark text-white"
                  : "bg-surface-tint text-ink-soft hover:bg-surface-line hover:text-ink"
              }`}
            >
              {t.nombre}
            </Link>
          ))}
        </div>

        {/* Episodios del podcast */}
        {episodios.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-extrabold text-ink mb-6 flex items-center gap-2">
              <Headphones size={22} className="text-verde-dark" aria-hidden />
              Escuchá sobre {tema.nombre.toLowerCase()}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {episodios.map((ep) => (
                <Link key={ep.slug} href={`/podcast/${ep.slug}`} className="group">
                  <div className="h-full rounded-2xl bg-gradient-to-br from-ink to-ink-soft p-5 transition-transform hover:scale-[1.02] shadow-md">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-verde/20 text-verde px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      <Headphones size={11} aria-hidden />
                      {ep.numero != null ? `Episodio ${ep.numero}` : "Episodio"}
                    </span>
                    <h3 className="mt-3 font-display text-base font-extrabold leading-snug text-white">
                      {ep.titulo}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        {ep.postCount} {ep.postCount === 1 ? "nota relacionada" : "notas relacionadas"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amarillo group-hover:underline">
                        <Play size={12} aria-hidden /> Escuchar
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA donación */}
        <DonacionCTA />

        {/* Artículos */}
        <h2 className="font-display text-2xl font-extrabold text-ink mb-6">
          Artículos sobre {tema.nombre.toLowerCase()}
        </h2>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/recursos/blog/${post.slug}`} className="group">
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <h3 className="font-display text-lg font-extrabold text-ink leading-snug group-hover:text-verde-dark transition-colors">
                    {post.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-3 flex-1">
                    {post.resumen}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} aria-hidden />
                      {formatDate(post.fecha)}
                    </span>
                    {post.episodio?.numero != null && (
                      <span className="inline-flex items-center gap-1">
                        <Headphones size={12} aria-hidden />
                        Ep. {post.episodio.numero}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-16 text-ink-soft">
            Próximamente: artículos sobre {tema.nombre.toLowerCase()}.
          </p>
        )}
      </Section>
    </main>
  );
}
