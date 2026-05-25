import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info, MessageCircle, Mail, Instagram, Linkedin } from "lucide-react";

import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contacto" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/contacto",
    locale: locale as Locale
  });
}

export default async function ContactoPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { locale } = await params;
  const { t: typeParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contacto" });

  const allowedTypes = ["personal", "voluntariado", "prensa", "empresa", "profesional", "otro"] as const;
  const initialType = (allowedTypes as readonly string[]).includes(typeParam ?? "") ? (typeParam as string) : "personal";

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <Section background="default" ariaLabelledBy="fast-channels">
        <div className="rounded-2xl bg-brand-warm-soft border border-brand-warm/20 p-5 md:p-6 mb-10 flex items-start gap-3">
          <Info size={20} aria-hidden className="text-brand-warm mt-0.5 shrink-0" />
          <p className="text-ink-soft text-sm md:text-base">{t("honesty")}</p>
        </div>

        <h2 id="fast-channels" className="sr-only">Canales rápidos y formulario</h2>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-4">
            <SectionHeading title={t("fastChannels")} />
            <ul className="space-y-4">
              <li>
                <a
                  href={site.whatsappCommunity}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-2xl bg-surface-card border border-surface-line p-5 hover:border-brand-teal transition-colors"
                >
                  <MessageCircle size={20} aria-hidden className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-semibold">WhatsApp Community</p>
                    <p className="text-sm text-ink-soft">{t("hero.subtitle").split(". ")[1]}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-2xl bg-surface-card border border-surface-line p-5 hover:border-brand-teal transition-colors"
                >
                  <Instagram size={20} aria-hidden className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-semibold">Instagram</p>
                    <p className="text-sm text-ink-soft">@casacusia.ong</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-2xl bg-surface-card border border-surface-line p-5 hover:border-brand-teal transition-colors"
                >
                  <Linkedin size={20} aria-hidden className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-semibold">LinkedIn</p>
                    <p className="text-sm text-ink-soft">Fundación Casacusia</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-start gap-3 rounded-2xl bg-surface-card border border-surface-line p-5 hover:border-brand-teal transition-colors"
                >
                  <Mail size={20} aria-hidden className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-ink-soft">{site.email}</p>
                  </div>
                </a>
              </li>
            </ul>
          </aside>

          <section aria-labelledby="form-title">
            <h3 id="form-title" className="font-display text-2xl md:text-3xl font-semibold mb-6">
              {t("writeUs")}
            </h3>
            <ContactForm initialType={initialType} />
          </section>
        </div>
      </Section>
    </>
  );
}
