import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, Calendar, User, Instagram, MessageCircle, Headphones, Play } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ContentSidebar } from "@/components/sections/ContentSidebar";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { EpisodioCTA } from "@/components/sections/EpisodioCTA";
import { DonacionCTA } from "@/components/sections/DonacionCTA";
import { Link } from "@/lib/i18n/navigation";
import { getBlogPostBySlug, getBlogPosts, getBlogRelacionados, getBlogPostsByEpisodio, getAliados } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

export async function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    ...buildMetadata({
      title: `${post.titulo} · Blog CASACUSIA`,
      description: post.resumen,
      path: `/recursos/blog/${post.slug}`,
      locale: locale as Locale
    }),
    openGraph: {
      type: "article",
      title: post.titulo,
      description: post.resumen,
      url: `${SITE_URL}/recursos/blog/${post.slug}`,
      siteName: "CASACUSIA",
      locale: locale === "en" ? "en_US" : "es_AR",
      publishedTime: post.fecha,
      authors: [post.autor]
    }
  };
}

function buildBlogPostJsonLd(post: BlogPost, locale: string) {
  const url = `${SITE_URL}${locale === "es" ? "" : `/${locale}`}/recursos/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.resumen,
    url,
    datePublished: post.fecha,
    author: {
      "@type": "Person",
      name: post.autor
    },
    publisher: {
      "@type": "Organization",
      name: "CASACUSIA",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logos/logo-vertical.png` }
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: locale === "en" ? "en" : "es",
    isPartOf: {
      "@type": "Blog",
      name: "Blog CASACUSIA",
      url: `${SITE_URL}/recursos/blog`
    }
  };
}

function formatDate(fecha: string): string {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function renderMarkdown(text: string) {
  // Rendereamos párrafos, negritas, itálicas y links sin deps extra
  return text.split("\n\n").map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Headings
    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="font-display text-xl font-extrabold text-ink mt-10 mb-4"
          dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed.slice(4)) }}
        />
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-display text-2xl font-extrabold text-ink mt-12 mb-4"
          dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed.slice(3)) }}
        />
      );
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote
          key={i}
          className="border-l-4 border-verde pl-5 my-6 text-lg italic text-ink-soft leading-relaxed"
          dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed.slice(2)) }}
        />
      );
    }

    // Lists (unordered)
    if (trimmed.split("\n").every((l) => l.startsWith("- ") || l.startsWith("* "))) {
      return (
        <ul key={i} className="list-disc pl-6 my-4 space-y-1.5 text-ink-soft leading-relaxed">
          {trimmed.split("\n").map((li, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inlineFormat(li.slice(2)) }} />
          ))}
        </ul>
      );
    }

    // Separador
    if (trimmed === "---") {
      return <hr key={i} className="my-10 border-surface-line" />;
    }

    // Párrafo normal
    return (
      <p
        key={i}
        className="text-ink-soft leading-relaxed mb-5"
        dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }}
      />
    );
  });
}

// Divide el contenido en dos mitades, cortando en un heading cercano al medio,
// para intercalar el CTA al episodio sin partir una sección.
function splitForCta(text: string): [string, string] {
  const blocks = text.split("\n\n");
  if (blocks.length < 6) return [text, ""];
  let idx = Math.floor(blocks.length / 2);
  for (let d = 0; d < 4; d++) {
    if (blocks[idx + d]?.trim().startsWith("## ")) {
      idx = idx + d;
      break;
    }
    if (blocks[idx - d]?.trim().startsWith("## ")) {
      idx = idx - d;
      break;
    }
  }
  return [blocks.slice(0, idx).join("\n\n"), blocks.slice(idx).join("\n\n")];
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-ink">$1</strong>')
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-verde-dark font-medium underline underline-offset-2 hover:text-verde transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/\n/g, "<br />");
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const notasDelEpisodio = post.episodio
    ? getBlogPostsByEpisodio(post.episodio.slug).filter((p) => p.slug !== post.slug)
    : [];
  const relacionados = getBlogRelacionados(post).filter(
    (r) => !notasDelEpisodio.some((n) => n.slug === r.slug)
  );
  const jsonLd = buildBlogPostJsonLd(post, locale);
  const [contenidoA, contenidoB] = post.episodio ? splitForCta(post.contenido) : [post.contenido, ""];
  const aliados = getAliados({ destacados: true }).map((a) => ({
    slug: a.slug,
    nombre: a.nombre,
    logo: a.logo
  }));

  return (
    <main className="bg-surface-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-16">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          {/* Columna principal */}
          <article>
            <Link
              href="/recursos/blog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4 mb-8"
            >
              <ArrowLeft size={16} aria-hidden /> {t("volverAlBlog")}
            </Link>

            {/* Etiquetas */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.etiquetas.map((tag) => (
                <Link
                  key={tag}
                  href={`/recursos/blog/etiqueta/${tag}`}
                  className="inline-block rounded-full bg-verde-soft px-3 py-1 text-xs font-semibold text-verde-dark hover:bg-verde-dark hover:text-white transition-colors"
                >
                  {t(`etiqueta.${tag}`)}
                </Link>
              ))}
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink">
              {post.titulo}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
              {post.episodio ? (
                <span className="inline-flex items-center gap-1.5">
                  <Headphones size={14} aria-hidden />
                  Fuente:{" "}
                  <Link
                    href={`/podcast/${post.episodio.slug}`}
                    className="font-semibold text-verde-dark underline underline-offset-2 hover:text-verde transition-colors"
                  >
                    {post.episodio.numero != null ? `Episodio ${post.episodio.numero} — ` : ""}
                    {post.episodio.titulo}
                  </Link>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} aria-hidden /> {post.autor}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} aria-hidden /> {formatDate(post.fecha)}
              </span>
            </div>

            {/* Contenido, con bloque de origen al episodio madre intercalado */}
            <div className="mt-10 text-base md:text-lg">
              {renderMarkdown(contenidoA)}
              {post.episodio && (
                <div className="my-10 rounded-2xl bg-verde-dark text-white p-6 md:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                        <Headphones size={13} aria-hidden />
                        {post.episodio.numero != null
                          ? `Episodio ${post.episodio.numero} · Sordo pero no mudo`
                          : "Sordo pero no mudo"}
                      </span>
                      <p className="mt-2.5 font-display font-extrabold leading-snug text-base md:text-lg">
                        Esta nota nace de: {post.episodio.titulo}
                      </p>
                    </div>
                    <Link
                      href={`/podcast/${post.episodio.slug}`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-amarillo px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-105"
                    >
                      <Play size={15} aria-hidden /> Ver el episodio
                    </Link>
                  </div>
                  {notasDelEpisodio.length > 0 && (
                    <div className="mt-4 border-t border-white/15 pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white/70 mb-2">
                        Otras notas de este episodio
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {notasDelEpisodio.map((n) => (
                          <Link
                            key={n.slug}
                            href={`/recursos/blog/${n.slug}`}
                            className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold hover:bg-white/25 transition-colors"
                          >
                            {n.titulo}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {contenidoB && renderMarkdown(contenidoB)}
            </div>

            {/* CTA de cierre al episodio */}
            {post.episodio && (
              <EpisodioCTA
                slug={post.episodio.slug}
                titulo={post.episodio.titulo}
                numero={post.episodio.numero}
              />
            )}

            {/* CTA de donación */}
            <DonacionCTA />

            {/* Más notas del mismo episodio */}
            {notasDelEpisodio.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-extrabold text-ink mb-6">
                  Más notas de este episodio
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {notasDelEpisodio.map((rel) => (
                    <Link key={rel.slug} href={`/recursos/blog/${rel.slug}`} className="group">
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <h3 className="font-display text-base font-extrabold text-ink leading-snug group-hover:text-verde-dark transition-colors">
                          {rel.titulo}
                        </h3>
                        <p className="mt-1.5 text-sm text-ink-soft line-clamp-2">{rel.resumen}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sección de comentarios Instagram */}
            <div className="mt-16 pt-10 border-t border-surface-line">
              <h2 className="font-display text-2xl font-extrabold text-ink mb-2 flex items-center gap-2">
                <MessageCircle size={22} aria-hidden />
                {t("comentarios")}
              </h2>

              {post.instagramComments && post.instagramComments.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {post.instagramComments.map((comment, i) => (
                    <div key={i} className="rounded-xl bg-surface-tint p-4 border border-surface-line">
                      <p className="font-bold text-sm text-ink">@{comment.usuario}</p>
                      <p className="mt-1 text-sm text-ink-soft leading-relaxed">{comment.texto}</p>
                      {comment.fecha && (
                        <p className="mt-1.5 text-xs text-ink-muted">{comment.fecha}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-ink-soft text-sm">{t("sinComentarios")}</p>
              )}

              {post.instagramUrl ? (
                <a
                  href={post.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  <Instagram size={18} aria-hidden />
                  {t("comentarEnInstagram")}
                </a>
              ) : (
                <p className="mt-4 text-xs text-ink-muted">{t("comentariosProximamente")}</p>
              )}
            </div>

            {/* Newsletter */}
            <div className="mt-12">
              <NewsletterForm
                labels={{
                  titulo: t("newsletter.titulo"),
                  subtitulo: t("newsletter.subtitulo"),
                  nombre: t("newsletter.nombre"),
                  email: t("newsletter.email"),
                  boton: t("newsletter.boton"),
                  exito: t("newsletter.exito")
                }}
              />
            </div>

            {/* Notas relacionadas */}
            {relacionados.length > 0 && (
              <div className="mt-16 pt-10 border-t border-surface-line">
                <h2 className="font-display text-2xl font-extrabold text-ink mb-6">
                  {t("relacionados")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relacionados.map((rel) => (
                    <Link key={rel.slug} href={`/recursos/blog/${rel.slug}`} className="group">
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {rel.etiquetas.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block rounded-full bg-verde-soft px-2 py-0.5 text-[10px] font-semibold text-verde-dark"
                            >
                              {t(`etiqueta.${tag}`)}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-display text-base font-extrabold text-ink leading-snug group-hover:text-verde-dark transition-colors">
                          {rel.titulo}
                        </h3>
                        <p className="mt-1.5 text-xs text-ink-muted">
                          {rel.episodio?.numero != null
                            ? `Del episodio ${rel.episodio.numero} · ${formatDate(rel.fecha)}`
                            : `${rel.autor} · ${formatDate(rel.fecha)}`}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <div className="mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <ContentSidebar aliados={aliados} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
