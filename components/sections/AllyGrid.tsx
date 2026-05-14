"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getAliados, type Aliado } from "@/lib/content";

type Props = { variant?: "home" | "full" };

export function AllyGrid({ variant = "home" }: Props) {
  const t = useTranslations("home.aliados");
  const allAliados = variant === "home" ? getAliados({ destacados: true }) : getAliados();

  const sponsorsSlugs = ["marval", "helen-diller-foundation"];
  const sponsors = allAliados.filter((a) => sponsorsSlugs.includes(a.slug));
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

      <div className="space-y-10">
        {/* Tier 1: Nos impulsan — más chicos */}
        {sponsors.length > 0 && (
          <div>
            <h3 className="text-lg font-display font-bold text-center mb-6 text-ink tracking-tight">{t("nosImpulsan")}</h3>
            <ul className="flex justify-center gap-4 flex-wrap">
              {sponsors.map((a) => (
                <AliadoCard key={a.slug} aliado={a} size="sponsor" aporteLabel={t("aporte")} />
              ))}
            </ul>
          </div>
        )}

        {/* Tier 2: Colaboraron — carrusel horizontal infinito */}
        {colaboradores.length > 0 && (
          <div>
            <h3 className="text-base font-display font-medium text-center mb-6 text-ink-soft">{t("colaboraron")}</h3>
            <LogoCarousel aliados={colaboradores} aporteLabel={t("aporte")} />
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

/** Infinite scrolling logo carousel */
function LogoCarousel({ aliados, aporteLabel }: { aliados: Aliado[]; aporteLabel: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let pos = 0;
    const speed = 0.5; // px per frame

    function step() {
      pos += speed;
      const half = el!.scrollWidth / 2;
      if (pos >= half) pos = 0;
      el!.scrollLeft = pos;
      animationId = requestAnimationFrame(step);
    }

    animationId = requestAnimationFrame(step);

    const pause = () => cancelAnimationFrame(animationId);
    const resume = () => { animationId = requestAnimationFrame(step); };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

  // Duplicate for seamless loop
  const items = [...aliados, ...aliados];

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-hidden"
      style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
    >
      {items.map((a, i) => (
        <AliadoCard key={`${a.slug}-${i}`} aliado={a} size="carousel" aporteLabel={aporteLabel} />
      ))}
    </div>
  );
}

function AliadoCard({ aliado, size, aporteLabel }: { aliado: Aliado; size: "sponsor" | "carousel"; aporteLabel: string }) {
  const width = size === "sponsor" ? "w-36 md:w-44" : "w-28 md:w-32 flex-shrink-0";

  const content = (
    <div
      className={`group relative flex items-center justify-center aspect-[3/2] rounded-[1.5rem] bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300 ${width}`}
      aria-label={`${aliado.nombre} · ${aliado.sector}`}
    >
      <Image
        src={aliado.logo}
        alt={aliado.nombre}
        fill
        className={`object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 ${size === "sponsor" ? "p-5" : "p-4"}`}
      />
      <span className="sr-only">{aliado.nombre}</span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 w-44 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
        <div className="relative bg-[#143642] text-white p-3 rounded-2xl shadow-xl text-center">
          <p className="text-[10px] font-bold text-[#00B980] uppercase tracking-wider mb-1">
            {aporteLabel}
          </p>
          <p className="text-[11px] md:text-xs font-medium leading-snug">
            {aliado.impacto}
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#143642]" />
        </div>
      </div>
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
