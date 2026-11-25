import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { buildMetadata } from "@/lib/seo";
import { getExperiencia } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { TopBar } from "@/components/experiencia/Secciones";
import { Viaje } from "@/components/experiencia/Viaje";

/**
 * Pantalla de pruebas de la landing: para ver variantes antes de llevarlas a
 * la página real. Fuera del índice y del sitemap.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Pruebas · Experiencia inmersiva",
    description: "Pantalla interna de pruebas.",
    path: "/experiencia-inmersiva/pruebas",
    locale: locale as Locale,
    noindex: true
  });
}

export default async function PruebasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getExperiencia();

  return (
    <>
      <TopBar nav={c.nav} />
      {/* La versión anterior del recorrido: una estación debajo de la otra. */}
      <Viaje hero={c.hero} viaje={c.viaje} />
    </>
  );
}
