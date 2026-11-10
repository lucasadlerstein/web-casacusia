import type { ExperienciaEfecto } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

/**
 * La misma frase, vista como se oiría con cada pérdida auditiva.
 * Es una traducción visual: quien usa lector de pantalla recibe la descripción.
 */

/** Consonantes agudas, las primeras que se pierden en una pérdida neurosensorial. */
const AGUDAS = new Set(["p", "t", "k", "c", "q", "f", "s", "z"]);

function esAguda(frase: string, i: number): boolean {
  const letra = (frase[i] ?? "").toLowerCase();
  if (AGUDAS.has(letra)) return true;
  // La "h" de "ch" y la "u" muda de "qu" se van con su consonante.
  const anterior = frase[i - 1]?.toLowerCase();
  return (letra === "h" && anterior === "c") || (letra === "u" && anterior === "q");
}

const CONTENEDOR: Record<ExperienciaEfecto, string> = {
  clara: "",
  atenuada: "opacity-30 blur-[1.5px]",
  recortada: "",
  unLado: "[mask-image:linear-gradient(90deg,black_30%,transparent_72%)]",
  lejana: "opacity-45 blur-[1px]"
};

export function Frase({
  frase,
  efecto,
  etiqueta,
  descripcion
}: {
  frase: string;
  efecto: ExperienciaEfecto;
  etiqueta: string;
  descripcion: string;
}) {
  const recorta = efecto === "recortada" || efecto === "lejana";
  return (
    <figure className="my-8 border-l-2 border-[color:var(--acento)] pl-5 md:my-10 md:pl-7">
      <figcaption className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[color:var(--acento)]">
        {etiqueta}
      </figcaption>
      {/* Con el fondo animado activo, estas letras se ocultan (siguen reservando el lugar)
          y las dibuja ViajeFondo: salen de la espiral y vienen a ocupar este sitio. */}
      <p
        aria-hidden="true"
        data-frase=""
        data-efecto={efecto}
        className={cn(
          "mt-3 font-display text-[1.7rem] font-bold leading-[1.2] tracking-[-0.01em] text-exp-crema sm:text-4xl md:text-[2.75rem]",
          "group-data-[letras=on]/viaje:invisible",
          CONTENEDOR[efecto]
        )}
      >
        {Array.from(frase).map((letra, i) => {
          const aguda = esAguda(frase, i);
          return (
            <span key={i} data-letra="" data-aguda={aguda ? "" : undefined} className={recorta && aguda ? "opacity-10" : undefined}>
              {letra}
            </span>
          );
        })}
      </p>
      <p className="sr-only">
        «{frase}» {descripcion}
      </p>
    </figure>
  );
}
