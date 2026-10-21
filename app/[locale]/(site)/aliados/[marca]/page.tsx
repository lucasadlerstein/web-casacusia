import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { getAliadoBySlug, getAliados } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateStaticParams() {
  return getAliados().map((a) => ({ marca: a.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; marca: string }>;
}): Promise<Metadata> {
  const { locale, marca } = await params;
  const aliado = getAliadoBySlug(marca);
  if (!aliado) return {};
  return buildMetadata({
    title: `${aliado.nombre} + CASACUSIA`,
    description: aliado.impacto,
    path: `/aliados/${aliado.slug}`,
    locale: locale as Locale
  });
}

export default async function AliadoPage({
  params
}: {
  params: Promise<{ locale: string; marca: string }>;
}) {
  const { locale, marca } = await params;
  setRequestLocale(locale);
  const aliado = getAliadoBySlug(marca);
  if (!aliado) notFound();

  return (
    <>
      <PageHero
        eyebrow={aliado.sector}
        title={`${aliado.nombre} + CASACUSIA`}
        subtitle={aliado.impacto}
      />

      <Section background="default">
        <div className="max-w-3xl space-y-6">
          <div className="flex flex-wrap gap-2">
            {aliado.tipoAlianza.map((ta) => (
              <Tag key={ta}>{ta}</Tag>
            ))}
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface-card border border-surface-line p-5">
              <dt className="text-xs uppercase tracking-wider text-ink-muted font-semibold">Sector</dt>
              <dd className="mt-1 font-medium">{aliado.sector}</dd>
            </div>
            <div className="rounded-2xl bg-surface-card border border-surface-line p-5">
              <dt className="text-xs uppercase tracking-wider text-ink-muted font-semibold">Aliado desde</dt>
              <dd className="mt-1 font-medium">{aliado.desde}</dd>
            </div>
          </dl>
          {aliado.web ? (
            <a
              href={aliado.web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-teal-dark underline underline-offset-4"
            >
              Sitio web de {aliado.nombre} <ExternalLink size={14} aria-hidden />
            </a>
          ) : null}
        </div>
      </Section>
    </>
  );
}
