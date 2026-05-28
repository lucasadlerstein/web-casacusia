import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandHeart } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { Section } from "@/components/ui/Section";
import { getAliados, type Aliado } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

/** Logos destacados arriba: nos impulsan a crecer. */
const SPONSORS_IMPULSAN = ["marval", "helen-diller-foundation"];

/** Carrusel de fotos de Casacusia que va al final */
const FOTOS_GALERIA = [
  "/fotos-nuevas/eventos/casacusia_gz-102.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-117.jpg",
  "/fotos-nuevas/eventos/bariloche.jpg",
  "/fotos-nuevas/eventos/003a0237.jpg",
  "/fotos-nuevas/eventos/img_7290heic.jpg",
  "/fotos-nuevas/eventos/img_6390.jpg"
];

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aliados" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/aliados",
    locale: locale as Locale
  });
}

export default async function AliadosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allAliados = getAliados();
  const sponsors = allAliados.filter((a) => SPONSORS_IMPULSAN.includes(a.slug));
  const resto = allAliados.filter((a) => !SPONSORS_IMPULSAN.includes(a.slug));

  return (
    <main className="bg-surface-bg">
      {/* Bloque 1: Nos impulsan a crecer */}
      {sponsors.length > 0 && (
        <section className="pt-16 pb-12 md:pt-20">
          <div className="container max-w-5xl mx-auto px-4">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-ink text-center">
              Nos impulsan a crecer.
            </h1>

            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto items-stretch">
              {sponsors.map((a) => (
                <li key={a.slug} className="flex">
                  <SponsorCard aliado={a} />
                </li>
              ))}
              <li className="flex">
                <Link
                  href={`/${locale}/contacto?t=empresa`}
                  className="group flex flex-col items-center justify-center text-center gap-2 w-full rounded-2xl border-2 border-dashed border-verde-dark/40 bg-verde-soft/40 px-5 py-7 hover:border-verde-dark hover:bg-verde-soft transition-colors"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-verde-dark text-white">
                    <HandHeart size={20} aria-hidden />
                  </span>
                  <span className="font-display font-extrabold text-verde-dark leading-tight">
                    Quiero impulsar también
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft">
                    Sumá a tu empresa <ArrowRight size={12} aria-hidden className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* Bloque 2: Todos los demás */}
      <Section background="tint" ariaLabelledBy="todos-title" className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 id="todos-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink">
            Todos los aliados
          </h2>

          <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {resto.map((a) => (
              <li key={a.slug}>
                <LogoCard aliado={a} />
              </li>
            ))}
          </ul>

          <p className="mt-12 text-center text-sm text-ink-muted max-w-xl mx-auto">
            ¿Tu empresa quiere ser parte?{" "}
            <Link href={`/${locale}/sumate/proyectos-juntos`} className="font-bold text-verde-dark underline underline-offset-4 hover:text-[#0a6b42]">
              Conocé cómo →
            </Link>
          </p>
        </div>
      </Section>

      {/* Bloque 3: Fotos de Casacusia */}
      <Section background="default" className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink mb-6 text-center">
            Casacusia en acción
          </h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {FOTOS_GALERIA.map((src) => (
              <li key={src} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-surface-line">
                <Image
                  src={src}
                  alt="Casacusia"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  );
}

function SponsorCard({ aliado }: { aliado: Aliado }) {
  const card = (
    <div className="group relative flex items-center justify-center w-full aspect-[5/3] rounded-2xl bg-white border border-surface-line p-5 shadow-sm hover:shadow-md hover:border-verde-dark/30 transition-all duration-300">
      <div className="relative w-full h-full">
        <Image
          src={aliado.logo}
          alt={aliado.nombre}
          fill
          className="object-contain p-3"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <span className="sr-only">{aliado.nombre}</span>
    </div>
  );

  return aliado.web ? (
    <a href={aliado.web} target="_blank" rel="noopener noreferrer" aria-label={`${aliado.nombre} — sitio web`} className="block w-full">
      {card}
    </a>
  ) : card;
}

function LogoCard({ aliado }: { aliado: Aliado }) {
  const card = (
    <div className="group relative flex items-center justify-center aspect-[3/2] rounded-2xl bg-white border border-surface-line p-4 shadow-sm hover:shadow-md hover:border-verde-dark/20 transition-all duration-300">
      <Image
        src={aliado.logo}
        alt={aliado.nombre}
        fill
        className="object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <span className="sr-only">{aliado.nombre}</span>
    </div>
  );

  return aliado.web ? (
    <a href={aliado.web} target="_blank" rel="noopener noreferrer" aria-label={`${aliado.nombre} — sitio web`} className="block">
      {card}
    </a>
  ) : card;
}
