import Image from "next/image";
import { ArrowRight, HandHeart } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/navigation";
import { getAliados, type Aliado } from "@/lib/content";

type Props = { variant?: "home" | "full" };

const SPONSORS_IMPULSAN = ["marval", "helen-diller-foundation"];
// Empresas que no mostramos en el grid "nos acompañaron" del home.
const EXCLUIR_HOME = ["fime-bastidores", "parque-de-innovacion", "carrefour"];
// Aliado que va fijo en 2da posición del grid.
const SEGUNDO_FIJO = "infinidad";

export function AllyGrid({ variant = "home" }: Props) {
  const allAliados = getAliados();
  const sponsors = allAliados.filter((a) => SPONSORS_IMPULSAN.includes(a.slug));

  let resto = allAliados.filter(
    (a) => !SPONSORS_IMPULSAN.includes(a.slug) && !EXCLUIR_HOME.includes(a.slug)
  );
  const segundo = resto.find((a) => a.slug === SEGUNDO_FIJO);
  if (segundo) {
    resto = resto.filter((a) => a.slug !== SEGUNDO_FIJO);
    resto.splice(1, 0, segundo);
  }

  return (
    <Section background="default" ariaLabelledBy="ally-grid-title">
      <div className="max-w-5xl mx-auto">
        <h2 id="ally-grid-title" className="font-display text-3xl md:text-4xl font-extrabold text-ink text-center mb-12">
          Instituciones que nos impulsan
        </h2>

        <div className="space-y-14">
          {/* 1. Nos impulsan a crecer */}
          {sponsors.length > 0 && (
            <div>
              <h3 className="text-sm font-display font-bold text-center mb-5 text-ink uppercase tracking-[0.2em]">
                Nos impulsan a crecer
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto items-stretch">
                {sponsors.map((a) => (
                  <li key={a.slug} className="flex">
                    <AliadoCard aliado={a} size="sponsor" />
                  </li>
                ))}
                <li className="flex">
                  <Link
                    href="/contacto?t=empresa"
                    className="group flex flex-col items-center justify-center text-center gap-2 w-full rounded-2xl border-2 border-dashed border-verde-dark/40 bg-verde-soft/40 px-5 py-7 hover:border-verde-dark hover:bg-verde-soft transition-colors"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-verde-dark text-white">
                      <HandHeart size={20} aria-hidden />
                    </span>
                    <span className="font-display font-extrabold text-verde-dark leading-tight">
                      Quiero impulsar también
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft">
                      Sumá a tu empresa <ArrowRight size={12} aria-hidden className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* 2. Red de Empresas que Escuchan */}
          <div>
            <div className="text-center mb-6">
              <h3 className="font-display text-xl md:text-2xl font-extrabold text-ink mb-2">
                La Red de Empresas que Escuchan
              </h3>
              <p className="text-sm text-ink-soft max-w-xl mx-auto">
                Empresas del rubro auditivo que acompañan a personas con pérdida auditiva. Si conocés alguna que pueda sumarse, escribinos.
              </p>
            </div>
            <ul className="space-y-3 max-w-3xl mx-auto">
              {[
                { label: "Audífonos", color: "border-verde-dark/30 bg-verde-soft/30" },
                { label: "Implantes", color: "border-violeta/30 bg-violeta-soft/30" },
                { label: "Centros médicos", color: "border-rosa/30 bg-rosa-soft/30" }
              ].map((cat) => (
                <li
                  key={cat.label}
                  className={`flex items-center justify-between rounded-2xl border-2 ${cat.color} px-5 py-4`}
                >
                  <span className="font-display font-bold text-ink">{cat.label}</span>
                  <span className="text-xs uppercase tracking-wider font-bold text-ink-muted">
                    Próximamente
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-sm text-ink-soft">
              ¿Tu empresa quiere ser parte?{" "}
              <Link href="/contacto?t=empresa" className="font-bold text-verde-dark underline underline-offset-4 hover:text-[#0a6b42]">
                Escribinos →
              </Link>
            </p>
          </div>

          {/* 3. Empresas que nos acompañaron */}
          {resto.length > 0 && (
            <div>
              <h3 className="text-sm font-display font-bold text-center mb-5 text-ink-soft uppercase tracking-[0.2em]">
                Empresas que nos acompañaron
              </h3>
              <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
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
          <div className="mt-12 text-center">
            <Button href="/aliados" variant="secondary">
              Ver todos los aliados
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
}

function AliadoCard({ aliado, size }: { aliado: Aliado; size: "sponsor" | "grid" }) {
  const styles = size === "sponsor"
    ? "w-full aspect-[3/2]"
    : "aspect-[3/2]";
  const padding = size === "sponsor" ? "p-5" : "p-3";

  const content = (
    <div
      className={`group relative flex items-center justify-center rounded-2xl bg-white border border-surface-line shadow-sm hover:shadow-md hover:border-verde-dark/30 transition-all duration-300 ${styles}`}
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
    <a href={aliado.web} target="_blank" rel="noopener noreferrer" className="block w-full">
      {content}
    </a>
  ) : (
    content
  );
}
