import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Users } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/navigation";
import { getVoluntarios, getComisionesConConteo } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const VOLUNTARIO_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSco0HoMcPR7RUJbbJsTpTf9b7iwsu0e60slEeJqhcZHEJErrg/viewform";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sumate.voluntariado" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/sumate/voluntariado",
    locale: locale as Locale
  });
}

export default async function VoluntariadoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sumate.voluntariado" });
  const voluntarios = getVoluntarios();
  const comisiones = getComisionesConConteo();

  return (
    <>
      <section className="bg-surface-bg pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <p className="font-display text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-rosa mb-5">
            Voluntariado
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-ink">
            Sumate como voluntario.
          </h1>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed">
            {voluntarios.length}+ personas ya sostienen Casacusia desde {comisiones.length} áreas distintas: encuentros, podcast, red de familias, comunicación, contenido, fundraising, tecnología y diseño. Sumate al equipo.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={VOLUNTARIO_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-verde-dark text-white hover:bg-[#0a6b42] transition-colors text-base px-7 py-3 font-bold"
            >
              Completar el formulario
              <ArrowRight size={16} aria-hidden />
            </a>
            <Link
              href="/nosotros/equipo"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand-teal-dark underline underline-offset-4"
            >
              <Users size={16} aria-hidden />
              Ver al equipo y voluntarios actuales
            </Link>
          </div>
        </div>
      </section>

      <Section background="tint" ariaLabelledBy="como-title" className="py-14">
        <div className="max-w-3xl mx-auto">
          <h2 id="como-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-6 text-center">
            ¿Cómo funciona?
          </h2>
          <ol className="space-y-4 text-ink leading-relaxed">
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-verde text-white text-sm font-bold">1</span>
              <p>Completás el formulario contándonos sobre vos y en qué áreas te gustaría aportar.</p>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rosa text-white text-sm font-bold">2</span>
              <p>Te leemos con atención. Si hay match con una de las áreas activas, te contactamos para una charla.</p>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violeta text-white text-sm font-bold">3</span>
              <p>Si no hay match inmediato, quedás en la red para cuando abramos esa área.</p>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amarillo text-ink text-sm font-bold">4</span>
              <p>En cualquier caso, te respondemos siempre.</p>
            </li>
          </ol>
        </div>
      </Section>

      <Section background="default" className="py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-ink-soft mb-5">¿Querés ver primero quiénes ya forman parte?</p>
          <Button href="/nosotros/equipo" variant="secondary" size="lg">
            Conocer al equipo y voluntarios →
          </Button>
        </div>
      </Section>
    </>
  );
}
