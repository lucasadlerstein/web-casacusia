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

/** Etiqueta técnica en mayúsculas, como los rótulos de la experiencia en pantalla. */
export function Rotulo({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[0.7rem] uppercase tracking-[0.22em] text-exp-crema/60 md:text-xs", className)}>
      {children}
    </p>
  );
}

const botonBase =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 font-display text-[0.95rem] font-bold " +
  "transition-[transform,background-color,color,border-color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 " +
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-amarillo";

const botonVariantes = {
  lleno: "bg-exp-crema text-exp-noche hover:bg-amarillo",
  borde: "border border-exp-crema/40 text-exp-crema hover:border-exp-crema hover:bg-exp-crema/10"
};

export function botonClases(variante: keyof typeof botonVariantes = "lleno", className?: string): string {
  return cn(botonBase, botonVariantes[variante], className);
}

/** Bloque estándar de las secciones que siguen al recorrido. */
export function Bloque({
  id,
  rotulo,
  titulo,
  intro,
  children,
  className
}: {
  id?: string;
  rotulo?: string;
  titulo: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 border-t border-exp-crema/10 py-20 md:py-28", className)}>
      <div className="container">
        <div className="max-w-3xl">
          {rotulo && <Rotulo className="mb-4">{rotulo}</Rotulo>}
          <h2 className="font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-exp-crema sm:text-4xl md:text-5xl">
            {titulo}
          </h2>
          {intro && <p className="mt-5 text-lg leading-relaxed text-exp-crema/75 md:text-xl">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
