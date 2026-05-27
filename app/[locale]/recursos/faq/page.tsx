import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CountryAwareDonateCTA } from "@/components/ui/CountryAwareDonateCTA";
import { getFAQs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Preguntas frecuentes sobre hipoacusia",
    description:
      "Respuestas concretas a las preguntas más frecuentes sobre hipoacusia, dispositivos, donaciones y Casacusia.",
    path: "/recursos/faq",
    locale: locale as Locale
  });
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqs = getFAQs();

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta }
    }))
  };

  // Separamos las FAQ de donar para sumar CTA propio
  const faqsDonar = faqs.filter((f) => f.categoria === "donar");
  const faqsResto = faqs.filter((f) => f.categoria !== "donar");

  return (
    <main className="bg-surface-bg">
      <section className="pt-16 pb-8 md:pt-20">
        <div className="container max-w-3xl mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink">
            Preguntas frecuentes
          </h1>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed">
            Respuestas concretas a las consultas más comunes sobre hipoacusia, dispositivos y cómo donar.
          </p>
        </div>
      </section>

      <Section background="default" className="pt-4 pb-10">
        <ul className="space-y-3 max-w-3xl">
          {faqsResto.map((f) => (
            <li key={f.id}>
              <details className="group rounded-2xl bg-surface-card border border-surface-line overflow-hidden">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 md:p-6 hover:bg-surface-tint transition-colors">
                  <h2 className="font-display text-base md:text-lg font-bold text-ink pr-4">
                    {f.pregunta}
                  </h2>
                  <span aria-hidden className="font-display text-2xl leading-none text-verde-dark transition-transform group-open:rotate-45 shrink-0">
                    +
                  </span>
                </summary>
                <p className="px-5 md:px-6 pb-5 md:pb-6 text-ink-soft leading-relaxed">
                  {f.respuesta}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </Section>

      {/* Bloque donar — preguntas + CTA */}
      {faqsDonar.length > 0 && (
        <Section background="tint" className="py-12">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-6">
              Donaciones
            </h2>
            <ul className="space-y-3 mb-8">
              {faqsDonar.map((f) => (
                <li key={f.id}>
                  <details className="group rounded-2xl bg-surface-card border border-surface-line overflow-hidden">
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 md:p-6 hover:bg-surface-bg transition-colors">
                      <h3 className="font-display text-base md:text-lg font-bold text-ink pr-4">
                        {f.pregunta}
                      </h3>
                      <span aria-hidden className="font-display text-2xl leading-none text-verde-dark transition-transform group-open:rotate-45 shrink-0">
                        +
                      </span>
                    </summary>
                    <p className="px-5 md:px-6 pb-5 md:pb-6 text-ink-soft leading-relaxed">
                      {f.respuesta}
                    </p>
                  </details>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl bg-surface-card border border-surface-line p-6 md:p-8 text-center">
              <p className="font-display text-lg md:text-xl font-bold text-ink mb-4">
                ¿Querés donar ahora?
              </p>
              <CountryAwareDonateCTA />
              <p className="mt-4 text-sm text-ink-muted">
                O conocé{" "}
                <Button href="/sumate/donar" variant="ghost" size="md">
                  los planes mensuales
                </Button>
              </p>
            </div>
          </div>
        </Section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
