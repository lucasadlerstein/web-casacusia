"use client";

import { useRef } from "react";
import type { ExperienciaContent } from "@/lib/content";
import { botonClases } from "./ui";

/**
 * El último post-it de la pared: invita a dejar el propio. Antes de salir a
 * Instagram avisa a dónde va la persona y qué hacer ahí. Sin base de datos:
 * los comentarios se leen y se suman a mano a `content/experiencia-inmersiva.json`.
 */
export function DejarVoz({ dejar }: { dejar: ExperienciaContent["voces"]["dejar"] }) {
  const dialogo = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        className="group flex h-full w-full flex-col items-start rounded-sm border-2 border-dashed border-ink/30 bg-white/40 p-6 text-left transition-colors duration-200 hover:border-ink/60 hover:bg-white/70 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-amarillo"
      >
        <span className="font-bubbles text-[1.6rem] font-bold leading-tight text-ink">{dejar.titulo}</span>
        <span className="mt-2 font-bubbles text-lg leading-snug text-ink-soft">{dejar.texto}</span>
        <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-bold text-ink underline decoration-amarillo decoration-[3px] underline-offset-4">
          {dejar.boton}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </span>
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby="dejar-voz-titulo"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-exp-crema p-7 text-ink shadow-2xl backdrop:bg-exp-noche/80 backdrop:backdrop-blur-sm md:p-9"
      >
        <h3 id="dejar-voz-titulo" className="font-display text-2xl font-extrabold leading-tight">
          {dejar.modalTitulo}
        </h3>
        <p className="mt-3 leading-relaxed text-ink-soft">{dejar.modalTexto}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={dejar.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => dialogo.current?.close()}
            className={botonClases("lleno", "bg-ink text-exp-crema")}
          >
            {dejar.ir}
            <span aria-hidden="true">↗</span>
          </a>
          <button type="button" onClick={() => dialogo.current?.close()} className={botonClases("borde", "border-ink/40 text-ink")}>
            {dejar.volver}
          </button>
        </div>
      </dialog>
    </>
  );
}
