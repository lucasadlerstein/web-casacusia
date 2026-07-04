import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, Headphones, Calendar } from "lucide-react";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { DonacionCTA } from "@/components/sections/DonacionCTA";
import { Link } from "@/lib/i18n/navigation";
import { getBlogPosts, blogEtiquetas, type BlogEtiqueta } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

function isValidTag(tag: string): tag is BlogEtiqueta {
  return (blogEtiquetas as readonly string[]).includes(tag);
}

export function generateStaticParams() {
  return blogEtiquetas.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag } = await params;
  if (!isValidTag(tag)) return {};
  const t = await getTranslations({ locale, namespace: "blog" });
  const tagLabel = t(`etiqueta.${tag}`);
  const desc = t(`etiquetaPage.desc.${tag}`);
  return buildMetadata({
    title: `${tagLabel} — Blog CASACUSIA`,
    description: desc,
    path: `/recursos/blog/etiqueta/${tag}`,
    locale: locale as Locale
  });
}

function formatDate(fecha: string): string {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function TagPage({
  params
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  if (!isValidTag(tag)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const tagLabel = t(`etiqueta.${tag}`);
  const desc = t(`etiquetaPage.desc.${tag}`);
  const posts = getBlogPosts({ etiqueta: tag });

  // Extraer episodios únicos de los posts con esta etiqueta
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
  const episodios = [...episodiosMap.values()].sort((a, b) => (b.numero ?? 0) - (a.numero ?? 0));

  // Otras etiquetas para navegación cruzada
  const otherTags = blogEtiquetas.filter((t) => t !== tag);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tagLabel} — Blog CASACUSIA`,
    description: desc,
    url: `${SITE_URL}/recursos/blog/etiqueta/${tag}`,
    isPartOf: {
      "@type": "Blog",
      name: "Blog CASACUSIA",
      url: `${SITE_URL}/recursos/blog`
    }
  };

  return (
    <main className="bg-surface-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title={<>{t("etiquetaPage.heroPrefix")}: <span className="text-verde">{tagLabel}</span></>}
        subtitle={desc}
      />

      <Section>
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/recursos/blog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4"
          >
            <ArrowLeft size={16} aria-hidden /> {t("etiquetaPage.verBlog")}
          </Link>
        </div>

        {/* Navegación entre etiquetas */}
        <div className="flex flex-wrap gap-2 mb-10" role="navigation" aria-label="Etiquetas">
          {blogEtiquetas.map((otherTag) => (
            <Link
              key={otherTag}
              href={`/recursos/blog/etiqueta/${otherTag}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                otherTag === tag
                  ? "bg-verde-dark text-white"
                  : "bg-surface-tint text-ink-soft hover:bg-surface-line hover:text-ink"
              }`}
            >
              {t(`etiqueta.${otherTag}`)}
            </Link>
          ))}
        </div>

        {/* Episodios del podcast relacionados */}
        {episodios.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-extrabold text-ink mb-6 flex items-center gap-2">
              <Headphones size={22} aria-hidden />
              {t("etiquetaPage.episodiosRelacionados")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {episodios.map((ep) => (
                <Link key={ep.slug} href={`/podcast/${ep.slug}`} className="group">
                  <div className="h-full rounded-2xl bg-ink text-white p-5 hover:bg-ink-soft transition-colors">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      <Headphones size={11} aria-hidden />
                      {ep.numero != null ? `Episodio ${ep.numero}` : "Episodio"}
                    </span>
                    <h3 className="mt-2 font-display text-base font-extrabold leading-snug">
                      {ep.titulo}
                    </h3>
                    <p className="mt-1 text-xs text-white/60">
                      {ep.postCount} {ep.postCount === 1 ? "nota" : "notas"}
                    </p>
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
          {t("etiquetaPage.articulosNotas")}
        </h2>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/recursos/blog/${post.slug}`} className="group">
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.etiquetas.map((etiq) => (
                      <span
                        key={etiq}
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          etiq === tag
                            ? "bg-verde-dark text-white"
                            : "bg-verde-soft text-verde-dark"
                        }`}
                      >
                        {t(`etiqueta.${etiq}`)}
                      </span>
                    ))}
                  </div>
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
            Todavía no hay notas con esta etiqueta.
          </p>
        )}
      </Section>
    </main>
  );
}
