"use client";

import { useState } from "react";
import { botonClases } from "./ui";

/** Despliega lo que en celular queda plegado: agrega una clase al contenedor y desaparece. */
export function VerMas({ objetivo, clase, etiqueta }: { objetivo: string; clase: string; etiqueta: string }) {
  const [abierto, setAbierto] = useState(false);
  if (abierto) return null;
  return (
    <div className="mt-8 flex justify-center md:hidden">
      <button
        type="button"
        className={botonClases("borde")}
        onClick={() => {
          document.getElementById(objetivo)?.classList.add(clase);
          setAbierto(true);
        }}
      >
        {etiqueta}
      </button>
    </div>
  );
}
