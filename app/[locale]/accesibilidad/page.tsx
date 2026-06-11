import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "accesibilidad" });
  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/accesibilidad",
    locale: locale as Locale
  });
}

export default async function AccesibilidadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "accesibilidad" });
  const items: string[] = t.raw("items");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <Section background="default">
        <div className="prose max-w-3xl space-y-6 text-ink leading-relaxed">
          <p dangerouslySetInnerHTML={{ __html: t("body1") }} />
          <h2 className="font-display text-2xl font-semibold">{t("queHacemos")}</h2>
          <ul className="list-disc pl-5 space-y-2">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h2 className="font-display text-2xl font-semibold">{t("siBarrera")}</h2>
          <p>
            {t.rich("contacto", {
              link: (chunks) => (
                <a href="mailto:hola@casacusia.org" className="underline underline-offset-4">
                  {chunks}
                </a>
              )
            })}
          </p>
          <p className="text-sm text-ink-muted">
            {t("ultimaRevision", {
              date: new Date().toLocaleDateString(locale === "en" ? "en-US" : "es-AR", { year: "numeric", month: "long" })
            })}
          </p>
        </div>
      </Section>
    </>
  );
}
