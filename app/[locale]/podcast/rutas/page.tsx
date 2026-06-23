import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ArrowLeft, Headphones } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Link } from "@/lib/i18n/navigation";
import { getRutasDeEscucha } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "podcast.rutas" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/podcast/rutas",
    locale: locale as Locale
  });
}

export default async function RutasPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "podcast.rutas" });
  const rutas = getRutasDeEscucha();

  return (
    <main className="bg-surface-bg">
      <section className="pt-14 pb-10 md:pt-16">
        <div className="container max-w-5xl mx-auto px-4">
          <Link
            href="/podcast"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4 mb-8"
          >
            <ArrowLeft size={16} aria-hidden /> {t("volverPodcast")}
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <Headphones size={24} className="text-verde-dark" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-verde-dark">
              Sordo pero no mudo
            </p>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-ink">
            {t("heading")}
          </h1>
          <p className="mt-4 text-base md:text-lg text-ink-soft leading-relaxed max-w-3xl">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <Section background="default" className="pb-20 pt-4">
        <div className="max-w-5xl mx-auto grid gap-5 sm:grid-cols-2">
          {rutas.map((ruta) => (
            <Link
              key={ruta.slug}
              href={`/podcast/rutas/${ruta.slug}`}
              className="group flex flex-col rounded-2xl bg-surface-card border border-surface-line p-6 md:p-8 hover:border-verde-dark hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-3" aria-hidden>{ruta.emoji}</span>
              <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink leading-snug group-hover:text-verde-dark transition-colors">
                {ruta.titulo}
              </h2>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-3 flex-1">
                {ruta.descripcion}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  {ruta.episodios.length} {t("episodios")}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark group-hover:underline underline-offset-4">
                  {t("escuchar")} <ArrowRight size={14} aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
