import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/sections/Hero";
import { Esencia } from "@/components/sections/Esencia";
import { AllyGrid } from "@/components/sections/AllyGrid";
import { EjesYProgramas } from "@/components/sections/EjesYProgramas";
import { ImpactStats } from "@/components/sections/ImpactStats";
import { ProximoEncuentro } from "@/components/sections/ProximoEncuentro";
import { PodcastDestacado } from "@/components/sections/PodcastDestacado";
import { CuatroCaminos } from "@/components/sections/CuatroCaminos";
import { Newsletter } from "@/components/sections/Newsletter";
import { TestimonioBlocks } from "@/components/sections/TestimonioBlocks";
import { ManifiestoHome } from "@/components/sections/ManifiestoHome";
import { EncuestaViviendo } from "@/components/sections/EncuestaViviendo";

import { buildMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { getEpisodios, getTestimonios } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/",
    locale: locale as Locale
  });
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const episodios = getEpisodios();
  const testimonios = getTestimonios({ destacados: true });

  return (
    <>
      <Hero />
      <Esencia />
      <ManifiestoHome />
      <EncuestaViviendo />
      <TestimonioBlocks testimonios={testimonios} />
      <ProximoEncuentro />
      <EjesYProgramas />
      <ImpactStats />
      <PodcastDestacado episodios={episodios} />
      <AllyGrid />
      <CuatroCaminos />
      <Newsletter />
    </>
  );
}
