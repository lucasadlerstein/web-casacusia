import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Linkedin, Instagram, Share2 } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const VOLUNTARIO_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSco0HoMcPR7RUJbbJsTpTf9b7iwsu0e60slEeJqhcZHEJErrg/viewform";

const SHARE_TEXT = encodeURIComponent(
  "Acabo de conocer Casacusia, una fundación que trabaja para que nadie transite la hipoacusia en soledad. Vale la pena leer su historia 👇"
);
const SHARE_URL = encodeURIComponent("https://casacusia.org/nosotros/historia");

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
      {/* Hero: presentación en primera persona con foto */}
      <section className="bg-surface-bg pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-verde/30 shadow-md shrink-0">
              <Image
                src="/fotos-nuevas/eventos/casacusia_gz-128.jpg"
                alt="Lucas Adlerstein"
                fill
                className="object-cover"
                sizes="160px"
                priority
              />
            </div>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-snug text-ink">
              {t("hero.intro")}
            </p>
          </div>
        </div>
      </section>

      {/* Línea de tiempo: cajas conectadas por punto y línea */}
      <Section background="default" ariaLabelledBy="historia-actos" className="pt-4 pb-16">
        <h2 id="historia-actos" className="sr-only">Cómo nació Casacusia</h2>
        <div className="relative max-w-3xl mx-auto">
          {/* Línea vertical central */}
          <div aria-hidden className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-[2px] bg-verde-dark/25" />

          <ol className="space-y-8 md:space-y-10">
            {actos.map((acto, i) => (
              <li key={i} className="relative pl-12 md:pl-14">
                {/* Punto sobre la línea */}
                <span
                  aria-hidden
                  className="absolute left-[6px] md:left-[10px] top-3 h-5 w-5 rounded-full bg-verde-dark border-4 border-surface-bg shadow-sm"
                />
                <div className="rounded-2xl bg-surface-card border border-surface-line p-6 md:p-7 shadow-sm">
                  <h3 className="font-display text-lg md:text-xl font-extrabold tracking-tight text-verde-dark mb-2">
                    {acto.titulo}
                  </h3>
                  <p className="text-base md:text-lg text-ink leading-relaxed">{acto.parrafo}</p>
                </div>
              </li>
            ))}
          </ol>
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

      {/* CTA blanco abajo + ayúdanos a llegar a más personas */}
      <Section background="default" ariaLabelledBy="historia-cta" className="py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 id="historia-cta" className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-3">
            {t("ctaTitle")}
          </h2>
          <p className="text-ink-soft mb-7">
            Ayudanos a llegar a más personas. Compartir esta página puede cambiarle el día a alguien.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
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

          {/* Share */}
          <div className="border-t border-surface-line pt-6">
            <p className="text-sm text-ink-muted mb-3 inline-flex items-center gap-1.5">
              <Share2 size={14} aria-hidden /> Compartir
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${SHARE_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-card border border-surface-line text-ink hover:border-verde-dark transition-colors text-sm px-4 py-2 font-semibold"
              >
                <Linkedin size={14} aria-hidden /> LinkedIn
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${SHARE_TEXT}%20${SHARE_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-card border border-surface-line text-ink hover:border-verde-dark transition-colors text-sm px-4 py-2 font-semibold"
              >
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${SHARE_TEXT}&url=${SHARE_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-card border border-surface-line text-ink hover:border-verde-dark transition-colors text-sm px-4 py-2 font-semibold"
              >
                X / Twitter
              </a>
              <a
                href="https://www.instagram.com/casacusia.ong/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-card border border-surface-line text-ink hover:border-verde-dark transition-colors text-sm px-4 py-2 font-semibold"
              >
                <Instagram size={14} aria-hidden /> Instagram
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
