import Image from "next/image";
import { useTranslations } from "next-intl";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getAliados, type Aliado } from "@/lib/content";

type Props = { variant?: "home" | "full" };

const SPONSORS_MES_A_MES = ["marval", "helen-diller-foundation"];

export function AllyGrid({ variant = "home" }: Props) {
  const t = useTranslations("home.aliados");
  const allAliados = getAliados();
  const sponsors = allAliados.filter((a) => SPONSORS_MES_A_MES.includes(a.slug));
  const resto = allAliados.filter((a) => !SPONSORS_MES_A_MES.includes(a.slug));

  return (
    <Section background="default" ariaLabelledBy="ally-grid-title">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={<span id="ally-grid-title">{t("title")}</span>}
        body={t("body")}
      />

      <div className="space-y-12">
        {/* Nos acompañan mes a mes */}
        {sponsors.length > 0 && (
          <div>
            <h3 className="text-sm font-display font-bold text-center mb-5 text-ink uppercase tracking-[0.2em]">
              Nos acompañan mes a mes
            </h3>
            <ul className="flex justify-center gap-6 flex-wrap">
              {sponsors.map((a) => (
                <li key={a.slug}>
                  <AliadoCard aliado={a} size="sponsor" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Grid completo del resto */}
        {resto.length > 0 && (
          <div>
            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
              {resto.map((a) => (
                <li key={a.slug}>
                  <AliadoCard aliado={a} size="grid" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {variant === "home" && (
        <div className="mt-10 text-center">
          <Button href="/aliados" variant="secondary">{t("cta")}</Button>
        </div>
      )}
    </Section>
  );
}

function AliadoCard({ aliado, size }: { aliado: Aliado; size: "sponsor" | "grid" }) {
  const styles = size === "sponsor"
    ? "w-44 md:w-52 aspect-[3/2]"
    : "aspect-[3/2]";
  const padding = size === "sponsor" ? "p-5" : "p-3";

  const content = (
    <div
      className={`group relative flex items-center justify-center rounded-2xl bg-white border border-surface-line p-4 shadow-sm hover:shadow-md hover:border-verde-dark/30 transition-all duration-300 ${styles}`}
      aria-label={`${aliado.nombre} · ${aliado.sector}`}
    >
      <Image
        src={aliado.logo}
        alt={aliado.nombre}
        fill
        className={`object-contain opacity-80 group-hover:opacity-100 transition-opacity ${padding}`}
      />
      <span className="sr-only">{aliado.nombre}</span>
    </div>
  );

  return aliado.web ? (
    <a href={aliado.web} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}
