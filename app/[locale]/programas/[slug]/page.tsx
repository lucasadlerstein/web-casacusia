import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Testimonial } from "@/components/sections/Testimonial";
import {
  getProgramas,
  getTestimonios,
  type TestimonioProyecto
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateStaticParams() {
  return getProgramas().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const programa = getProgramas().find((p) => p.slug === slug);
  if (!programa) return {};
  return buildMetadata({
    title: `${programa.titulo} · Programas`,
    description: programa.resumen,
    path: `/programas/${programa.slug}`,
    locale: locale as Locale
  });
}

/** Mapping de slug de programa a categoría de testimonio. */
const slugToProyecto: Record<string, TestimonioProyecto | undefined> = {
  encuentros: "encuentros-presenciales",
  "encuentros-virtuales": "encuentros-virtuales",
  "red-padres-madres": "red-familias",
  podcast: "podcast"
};

export default async function ProgramaDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const programa = getProgramas().find((p) => p.slug === slug);
  if (!programa) notFound();

  const proyecto = slugToProyecto[slug];
  const testimonios = proyecto ? getTestimonios({ proyecto }) : [];

  return (
    <>
      <PageHero
        eyebrow={programa.subtitulo}
        title={programa.titulo}
        subtitle={programa.resumen}
      />

      {testimonios.length > 0 && <Testimonial testimonios={testimonios} />}

      <Section background="default">
        <div className="max-w-3xl space-y-6 text-ink leading-relaxed">
          {testimonios.length === 0 && (
            <p className="text-lg text-ink-soft">
              Esta landing se completa con más contenido pronto: descripción extendida, próximos eventos, preguntas frecuentes y cómo sumarse.
            </p>
          )}
          <div className="pt-4 flex flex-wrap gap-3">
            <Button href="/sumate">Ser parte</Button>
            <Button href="/contacto" variant="secondary">Escribirnos</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
