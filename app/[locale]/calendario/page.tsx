import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";
import { getUpcomingEvents } from "@/lib/luma";
import { EventFilterClient } from "@/components/sections/EventFilterClient";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calendario" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/calendario",
    locale: locale as Locale,
  });
}

export default async function CalendarioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("calendario");
  const tFilters = await getTranslations("home.proximoEncuentro");
  const events = await getUpcomingEvents();

  const translations = {
    eyebrow: tFilters("eyebrow"),
    title: tFilters("title"),
    body: tFilters("body"),
    cta: tFilters("cta"),
    sinFecha: tFilters("sinFecha"),
    todos: tFilters("filtros.todos"),
    presencial: tFilters("filtros.presencial"),
    virtual: tFilters("filtros.virtual"),
    familias: tFilters("filtros.familias"),
    argentina: tFilters("filtros.argentina"),
    mundo: tFilters("filtros.mundo"),
    inscribite: tFilters("inscribite"),
    gratuito: tFilters("gratuito"),
  };

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
      />
      <Section background="default">
        <div className="rounded-3xl bg-[#143642] p-8 md:p-12">
          <EventFilterClient events={events} translations={translations} />
        </div>
      </Section>
    </>
  );
}
