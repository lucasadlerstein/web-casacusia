"use client";

import type { ReactNode } from "react";
import { botonClases } from "./ui";

const DIALOGO_ID = "sumate-dialogo";

/**
 * Botón «Llevarla a mi espacio»: abre el formulario como pop-up. Si el pop-up
 * no está (sin JS, o algo falló), el enlace lleva a la sección del final.
 */
export function BotonSumate({
  variante = "lleno",
  className,
  children
}: {
  variante?: "lleno" | "borde";
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#sumate"
      className={botonClases(variante, className)}
      onClick={(e) => {
        const dialogo = document.getElementById(DIALOGO_ID);
        if (!(dialogo instanceof HTMLDialogElement)) return;
        e.preventDefault();
        dialogo.showModal();
      }}
    >
      {children}
    </a>
  );
}
