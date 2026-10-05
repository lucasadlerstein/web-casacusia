import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { PageHero } from "@/components/ui/PageHero";
import { ImpactStats } from "@/components/sections/ImpactStats";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getReconocimientos } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impacto" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/impacto",
    locale: locale as Locale
  });
}

export default async function ImpactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "impacto" });

  const reconocimientos = getReconocimientos();

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />
      <ImpactStats />
      <Section background="tint" ariaLabelledBy="rec-title">
        <SectionHeading title={<span id="rec-title">{t("reconocimientos.title")}</span>} />
        <ul className="grid gap-4 md:grid-cols-2">
          {reconocimientos.map((r) => (
            <li key={`${r.titulo}-${r.organismo}`} className="rounded-2xl bg-surface-card border border-surface-line p-6">
              <p className="text-xs uppercase tracking-wider text-brand-teal-dark font-semibold">{r.organismo}</p>
              <p className="mt-2 font-display text-lg font-semibold">{r.titulo}</p>
              <p className="mt-2 text-sm text-ink-soft">{r.descripcion}</p>
              <p className="mt-3 text-xs text-ink-muted">{r.fecha}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
