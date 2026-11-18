import type { CSSProperties, ReactNode } from "react";
import type { ExperienciaAcento } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

/** Color de acento de cada estación, tomado de los tokens de marca. */
const ACENTOS: Record<ExperienciaAcento, string> = {
  crema: "var(--exp-crema)",
  verde: "var(--color-verde)",
  amatista: "var(--color-amatista)",
  rosa: "var(--color-rosa)",
  amarillo: "var(--color-amarillo)"
};

export function estiloAcento(acento: ExperienciaAcento): CSSProperties {
  return { "--acento": ACENTOS[acento] } as CSSProperties;
}

/**
 * Tonos de las secciones que siguen al recorrido. Alternarlos le da ritmo a la
 * página: el recorrido es a oscuras; cuando "se prenden las luces" (las voces)
 * la página también se ilumina. Cada tono define las variables que usan los
 * componentes: fondo, tinta, superficie de tarjetas y líneas.
 */
export type Tono = "noche" | "panel" | "luz";

const TONOS: Record<Tono, Record<string, string>> = {
  noche: {
    "--fondo": "var(--exp-noche)",
    "--sup": "rgb(var(--exp-panel-rgb))",
    "--tinta": "var(--exp-crema)",
    "--tinta-suave": "rgb(var(--exp-crema-rgb) / 0.75)",
    "--tinta-tenue": "rgb(var(--exp-crema-rgb) / 0.6)",
    "--linea": "rgb(var(--exp-crema-rgb) / 0.1)",
    "--linea-fuerte": "rgb(var(--exp-crema-rgb) / 0.4)",
    "--boton-fondo": "var(--exp-crema)",
    "--boton-tinta": "var(--exp-noche)"
  },
  panel: {
    "--fondo": "rgb(var(--exp-panel-rgb))",
    "--sup": "var(--exp-noche)",
    "--tinta": "var(--exp-crema)",
    "--tinta-suave": "rgb(var(--exp-crema-rgb) / 0.75)",
    "--tinta-tenue": "rgb(var(--exp-crema-rgb) / 0.6)",
    "--linea": "rgb(var(--exp-crema-rgb) / 0.1)",
    "--linea-fuerte": "rgb(var(--exp-crema-rgb) / 0.4)",
    "--boton-fondo": "var(--exp-crema)",
    "--boton-tinta": "var(--exp-noche)"
  },
  luz: {
    "--fondo": "var(--exp-crema)",
    "--sup": "#FFFFFF",
    "--tinta": "var(--color-ink)",
    "--tinta-suave": "var(--color-ink-soft)",
    "--tinta-tenue": "var(--color-ink-muted)",
    "--linea": "rgb(20 54 66 / 0.12)",
    "--linea-fuerte": "rgb(20 54 66 / 0.4)",
    "--boton-fondo": "var(--color-ink)",
    "--boton-tinta": "var(--exp-crema)"
  }
};

export function tonoEstilo(tono: Tono): CSSProperties {
  return TONOS[tono] as CSSProperties;
}

/** Clases que leen las variables del tono. Sirven dentro de cualquier sección. */
export const t = {
  fondo: "bg-[color:var(--fondo)]",
  sup: "bg-[color:var(--sup)]",
  tinta: "text-[color:var(--tinta)]",
  suave: "text-[color:var(--tinta-suave)]",
  tenue: "text-[color:var(--tinta-tenue)]",
  linea: "border-[color:var(--linea)]",
  lineaFuerte: "border-[color:var(--linea-fuerte)]"
} as const;

/** Etiqueta técnica en mayúsculas, como los rótulos de la experiencia en pantalla. */
export function Rotulo({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[0.7rem] uppercase tracking-[0.22em] md:text-xs", t.tenue, className)}>
      {children}
    </p>
  );
}

const botonBase =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 font-display text-[0.95rem] font-bold " +
  "transition-[transform,background-color,color,border-color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 " +
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-amarillo";

const botonVariantes = {
  lleno: "bg-[color:var(--boton-fondo)] text-[color:var(--boton-tinta)] hover:bg-amarillo hover:text-exp-noche",
  borde: cn("border", t.lineaFuerte, t.tinta, "hover:border-current hover:bg-[color:var(--sup)]")
};

export function botonClases(variante: keyof typeof botonVariantes = "lleno", className?: string): string {
  return cn(botonBase, botonVariantes[variante], className);
}

/** Bloque estándar de las secciones que siguen al recorrido. */
export function Bloque({
  id,
  tono = "noche",
  rotulo,
  titulo,
  intro,
  children,
  className
}: {
  id?: string;
  tono?: Tono;
  rotulo?: string;
  titulo: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      style={tonoEstilo(tono)}
      className={cn("scroll-mt-28 py-20 md:scroll-mt-20 md:py-28", t.fondo, t.tinta, tono !== "luz" && cn("border-t", t.linea), className)}
    >
      <div className="container">
        <div className="max-w-3xl">
          {rotulo && <Rotulo className="mb-4">{rotulo}</Rotulo>}
          <h2 className={cn("font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-4xl md:text-5xl", t.tinta)}>
            {titulo}
          </h2>
          {intro && <p className={cn("mt-5 text-lg leading-relaxed md:text-xl", t.suave)}>{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
