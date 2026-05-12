import Image from "next/image";
import { useTranslations } from "next-intl";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getAliados, type Aliado } from "@/lib/content";

type Props = { variant?: "home" | "full" };

export function AllyGrid({ variant = "home" }: Props) {
  const t = useTranslations("home.aliados");
  const allAliados = variant === "home" ? getAliados({ destacados: true }) : getAliados();

  // Tier 1: Nos impulsan
  const sponsorsSlugs = ["marval", "helen-diller-foundation"];
  const sponsors = allAliados.filter((a) => sponsorsSlugs.includes(a.slug));
  
  // Tier 2: Colaboraron con Casacusia
  const colaboradores = allAliados
    .filter((a) => !sponsorsSlugs.includes(a.slug))
    .sort((a, b) => a.orden - b.orden);

  return (
    <Section background="default" ariaLabelledBy="ally-grid-title">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={<span id="ally-grid-title">{t("title")}</span>}
        body={t("body")}
      />

      <div className="space-y-12">
        {/* Tier 1: Nos impulsan */}
        {sponsors.length > 0 && (
          <div>
            <h3 className="text-xl font-display font-bold text-center mb-6 text-ink tracking-tight">{t("nosImpulsan")}</h3>
            <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 justify-center">
              {sponsors.map((a) => (
                <AliadoCard key={a.slug} aliado={a} size="large" aporteLabel={t("aporte")} />
              ))}
            </ul>
          </div>
        )}

        {/* Tier 2: Colaboraron con Casacusia */}
        {colaboradores.length > 0 && (
          <div>
            <h3 className="text-lg font-display font-medium text-center mb-6 text-ink-soft">{t("colaboraron")}</h3>
            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4 justify-center">
              {colaboradores.map((a) => (
                <AliadoCard key={a.slug} aliado={a} aporteLabel={t("aporte")} />
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

function AliadoCard({ aliado, size = "default", aporteLabel }: { aliado: Aliado; size?: "default" | "large"; aporteLabel: string }) {
  const colSpan = size === "large" ? "md:col-span-2 lg:col-span-3" : "";
  const content = (
      <div
        className="flex items-center justify-center aspect-[3/2] rounded-xl bg-surface-card border border-surface-line p-4 hover:border-verde hover:shadow-card-hover transition-all duration-300"
        aria-label={`${aliado.nombre} · ${aliado.sector}`}
      >
        <Image
          src={aliado.logo}
          alt={aliado.nombre}
          fill
          className={`object-contain p-6 opacity-80 group-hover:opacity-100 transition-all duration-300 ${size === "large" ? "md:p-8" : ""}`}
        />
        <span className="sr-only">{aliado.nombre}</span>

        {/* Tooltip / Popover above */}
        <div className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
          <div className="relative bg-ink text-white p-3 rounded-2xl shadow-xl border border-white/10 text-center">
            <p className="text-[10px] font-bold text-verde uppercase tracking-wider mb-1">
              {aporteLabel}
            </p>
            <p className="text-[11px] md:text-xs font-medium leading-snug">
              {aliado.impacto}
            </p>
            
            {/* Triangle indicator */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-ink" />
          </div>
        </div>
      </div>
  );

  return (
    <li className={`group relative ${colSpan}`}>
      {aliado.web ? (
        <a href={aliado.web} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}
