import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const VOLUNTARIO_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSco0HoMcPR7RUJbbJsTpTf9b7iwsu0e60slEeJqhcZHEJErrg/viewform";

type Acto = { titulo: string; parrafo: string };

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nosotros.historia" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/nosotros/historia",
    locale: locale as Locale
  });
}

export default async function HistoriaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nosotros.historia" });
  const actos = t.raw("actos") as Acto[];

  return (
    <>
      {/* Hero: presentación en primera persona */}
      <section className="bg-surface-bg pt-20 pb-10 md:pt-24 md:pb-12">
        <div className="container max-w-3xl mx-auto px-4">
          <p className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-snug text-ink">
            {t("hero.intro")}
          </p>
        </div>
      </section>

      {/* Actos narrativos */}
      <Section background="default" ariaLabelledBy="historia-actos" className="pt-4 pb-16">
        <h2 id="historia-actos" className="sr-only">Cómo nació Casacusia</h2>
        <div className="max-w-3xl mx-auto space-y-12 md:space-y-14">
          {actos.map((acto, i) => (
            <article key={i}>
              <h3 className="font-display text-lg md:text-xl font-extrabold tracking-tight text-verde-dark mb-3">
                {acto.titulo}
              </h3>
              <p className="text-lg md:text-xl text-ink leading-relaxed">{acto.parrafo}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Insight + kicker — bloque azul */}
      <Section background="dark" ariaLabelledBy="historia-insight" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center text-white">
          <p
            id="historia-insight"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight"
          >
            {t("insight")}
          </p>
          <p className="mt-8 text-xl md:text-2xl text-white/85 leading-relaxed font-medium">
            {t("kicker")}
          </p>
        </div>
      </Section>

      {/* CTA blanco abajo */}
      <Section background="default" ariaLabelledBy="historia-cta" className="py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 id="historia-cta" className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-8">
            {t("ctaTitle")}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/sumate/donar" size="lg">
              {t("ctaPrimary")}
            </Button>
            <a
              href={VOLUNTARIO_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-card border border-surface-line text-ink hover:border-verde-dark transition-colors text-base px-6 py-3 font-semibold"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
