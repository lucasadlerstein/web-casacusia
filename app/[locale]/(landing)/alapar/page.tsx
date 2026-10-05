import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { buildMetadata } from "@/lib/seo";
import { getAlaPar } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { TopBar } from "@/components/alapar/TopBar";
import { Hero } from "@/components/alapar/Hero";
import { Momento } from "@/components/alapar/Momento";
import { Contraste } from "@/components/alapar/Contraste";
import { Dato } from "@/components/alapar/Dato";
import { ComoFunciona } from "@/components/alapar/ComoFunciona";
import { Roles } from "@/components/alapar/Roles";
import { ParaVos } from "@/components/alapar/ParaVos";
import { Sumate } from "@/components/alapar/Sumate";
import { Sostener } from "@/components/alapar/Sostener";
import { Cierre } from "@/components/alapar/Cierre";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { meta } = getAlaPar();
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    path: "/alapar",
    locale: locale as Locale,
    image: "/alapar/logo-cereza.png"
  });
}

export default async function AlaParPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getAlaPar();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: c.meta.title,
    description: c.meta.description,
    url: `${SITE_URL}/alapar`,
    inLanguage: "es-AR",
    isPartOf: { "@type": "WebSite", name: "CASACUSIA", url: SITE_URL },
    about: {
      "@type": "Service",
      name: "A la Par",
      serviceType: "Acompañamiento entre pares para personas con hipoacusia",
      provider: { "@type": "NGO", name: "Fundación Casacusia", url: SITE_URL },
      areaServed: "AR",
      isAccessibleForFree: true
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar nav={c.nav} />
      <Hero hero={c.hero} />
      <Momento momento={c.momento} />
      <Contraste contraste={c.contraste} />
      <Dato dato={c.dato} />
      <ComoFunciona como={c.comoFunciona} />
      <Roles roles={c.roles} />
      <ParaVos paraVos={c.paraVos} />
      <Sumate sumate={c.sumate} />
      <Sostener sostener={c.sostener} />
      <Cierre cierre={c.cierre} footer={c.footer} />
    </>
  );
}
