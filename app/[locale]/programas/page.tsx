import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { EncuestaViviendo } from "@/components/sections/EncuestaViviendo";
import { getProgramas, getTestimonios, type TestimonioProyecto } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "programas" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/programas",
    locale: locale as Locale
  });
}

const programaAssets: Record<string, { foto: string; tono: "verde" | "violeta" | "rosa" | "amarillo" | "teal" }> = {
  "encuentros":           { foto: "/fotos/propuestas/Casacusia_GZ-21.jpg",       tono: "verde" },
  "encuentros-virtuales": { foto: "/fotos/propuestas/DSC00009.jpg",              tono: "violeta" },
  "red-padres-madres":    { foto: "/fotos/propuestas/casacusia_kids_alta_186.jpg", tono: "rosa" },
  "comunidad-whatsapp":   { foto: "/fotos/encuentro-patio.jpg",                  tono: "verde" },
  "podcast":              { foto: "/brand/podcast/spnm-alta.jpg",                tono: "amarillo" },
  "cami":                 { foto: "/fotos/propuestas/DSC00009.jpg",              tono: "teal" },
  "recursera":            { foto: "/fotos/taller-adultos.jpg",                   tono: "rosa" }
};

const slugToProyecto: Record<string, TestimonioProyecto | undefined> = {
  "encuentros":           "encuentros-presenciales",
  "encuentros-virtuales": "encuentros-virtuales",
  "red-padres-madres":    "red-familias",
  "podcast":              "podcast"
};

const tonoBg: Record<string, string> = {
  verde:    "bg-verde-soft",
  violeta:  "bg-violeta-soft",
  rosa:     "bg-rosa-soft",
  amarillo: "bg-amarillo-soft",
  teal:     "bg-brand-teal-soft"
};

const tonoAccent: Record<string, string> = {
  verde:    "text-verde-dark",
  violeta:  "text-violeta-dark",
  rosa:     "text-rosa-dark",
  amarillo: "text-ink-soft",
  teal:     "text-brand-teal-dark"
};

export default async function ProgramasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "programas" });
  const programas = getProgramas();

  return (
    <main className="bg-surface-bg">
      <div className="container max-w-5xl mx-auto px-4 pt-14 pb-2 md:pt-16">
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-ink">
          {t("heading")}
        </h1>
        <p className="mt-4 font-display italic text-lg md:text-xl text-ink-soft leading-snug max-w-3xl">
          &ldquo;Imaginate pensar toda tu vida que eres el único, y descubrir que hay más personas atravesando lo mismo.&rdquo;
        </p>
      </div>

      <EncuestaViviendo hideIfAnswered />

      <div className="container max-w-5xl mx-auto px-4 pb-20 space-y-10 md:space-y-14">
        {programas.map((p, i) => {
          const assets = programaAssets[p.slug] ?? { foto: "/fotos/hero-comunidad.jpg", tono: "teal" as const };
          const proyecto = slugToProyecto[p.slug];
          const testimonios = proyecto ? getTestimonios({ proyecto, destacados: true }).slice(0, 2) : [];
          const isExternal = p.cta.href.startsWith("http");
          const isInverted = i % 2 === 1;
          const proximamente = p.cta.label.toLowerCase().includes("próximamente");

          return (
            <article
              key={p.slug}
              className={`rounded-3xl overflow-hidden border border-surface-line bg-surface-card grid md:grid-cols-2 ${
                isInverted ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Imagen */}
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px]">
                <Image
                  src={assets.foto}
                  alt={p.titulo}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {proximamente && (
                  <div className="absolute top-4 left-4 inline-flex items-center rounded-full bg-ink/85 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {t("proximamente")}
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-8 md:p-10 flex flex-col">
                <p className={`font-display text-xs font-bold uppercase tracking-[0.2em] ${tonoAccent[assets.tono]}`}>
                  {p.subtitulo}
                </p>
                <h2 className="mt-2 font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
                  {p.titulo}
                </h2>
                <p className="mt-4 text-ink-soft leading-relaxed">{p.resumen}</p>

                {testimonios.length > 0 && (
                  <ul className={`mt-6 space-y-3 p-5 rounded-2xl ${tonoBg[assets.tono]}`}>
                    {testimonios.map((tt) => (
                      <li key={tt.id}>
                        <p className="font-display text-sm md:text-base font-semibold text-ink leading-snug">
                          “{tt.fraseDestacada ?? tt.texto}”
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          — {tt.autor ?? "Mensaje de la comunidad"}
                          {(tt.contexto ?? tt.ubicacion) && ` · ${tt.contexto ?? tt.ubicacion}`}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {isExternal ? (
                    <a
                      href={p.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-5 py-2.5 text-sm font-bold hover:bg-ink-soft transition-colors"
                    >
                      {p.cta.label}
                      <ArrowRight size={14} aria-hidden />
                    </a>
                  ) : (
                    <Link
                      href={p.cta.href}
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-5 py-2.5 text-sm font-bold hover:bg-ink-soft transition-colors"
                    >
                      {p.cta.label}
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  )}
                  <Link
                    href={`/programas/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink underline underline-offset-4"
                  >
                    {t("verDetalle")}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
