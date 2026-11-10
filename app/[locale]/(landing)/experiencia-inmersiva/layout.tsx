import type { ReactNode } from "react";

/**
 * Layout autónomo de la landing Experiencia Inmersiva: sin Header ni Footer de
 * Casacusia y con identidad oscura (la sala a oscuras). Tipografía de la marca.
 */
export default function ExperienciaLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="flex-1 bg-exp-noche font-sans text-exp-crema [color-scheme:dark]">
      {children}
    </main>
  );
}
