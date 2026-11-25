import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { buildMetadata } from "@/lib/seo";
import { getExperiencia } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { EmpresasBloque, EmpresasHero, EmpresasNota } from "@/components/experiencia/Empresas";
import { EscenaPlaca } from "@/components/experiencia/EscenaPlaca";
import { Cierre, Espacios, Facilita, Sala, TopBar, Voces } from "@/components/experiencia/Secciones";
import { Sumate, SumateDialogo } from "@/components/experiencia/Sumate";
import { Rotulo } from "@/components/experiencia/ui";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";
const URL = `${SITE_URL}/experiencia-inmersiva/empresas`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { empresas } = getExperiencia();
  return buildMetadata({
    title: empresas.meta.title,
    description: empresas.meta.description,
    path: "/experiencia-inmersiva/empresas",
    locale: locale as Locale
  });
}

/**
 * La experiencia contada para empresas: qué es, por qué le sirve a un equipo,
 * qué se trabaja, qué queda y cómo se organiza. Comparte el formulario y las
 * piezas de la página principal.
 */
export default async function EmpresasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getExperiencia();
  const e = c.empresas;
  const [porQue, ...resto] = e.bloques;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: e.meta.title,
    description: e.meta.description,
    url: URL,
    serviceType: "Experiencia inmersiva de sensibilización sobre hipoacusia para equipos de trabajo",
    provider: { "@type": "NGO", name: "Fundación Casacusia", url: SITE_URL },
    areaServed: ["AR", "MX"]
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.preguntas.items.map((it) => ({ "@type": "Question", name: it.pregunta, acceptedAnswer: { "@type": "Answer", text: it.respuesta } }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <TopBar nav={{ ...c.nav, links: e.nav }} />
      <SumateDialogo sumate={c.sumate} url={URL} preguntas={c.preguntas} />

      <EmpresasHero hero={e.hero} />

      <section id="escenas" className="scroll-mt-28 border-t border-exp-crema/10 py-20 md:scroll-mt-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl">
            <Rotulo className="mb-4">{e.experiencia.rotulo}</Rotulo>
            <h2 className="font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-exp-crema sm:text-4xl md:text-5xl">
              {e.experiencia.titulo}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-exp-crema/75 md:text-xl">{e.experiencia.intro}</p>
          </div>
          <div className="mt-10">
            <EscenaPlaca viaje={c.viaje} />
          </div>
        </div>
      </section>

      {porQue && <EmpresasBloque bloque={porQue} />}
      {resto.map((b) => (
        <EmpresasBloque key={b.id} bloque={b} />
      ))}
      <Voces voces={c.voces} />
      <Facilita facilita={c.facilita} />
      <Espacios espacios={c.espacios} />
      <Sala sala={c.sala} />
      <EmpresasNota nota={e.nota} link={e.linkPrincipal} />
      <Sumate sumate={c.sumate} url={URL} preguntas={c.preguntas} />
      <Cierre cierre={c.cierre} />
    </>
  );
}
