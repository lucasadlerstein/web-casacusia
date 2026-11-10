"use client";

import { useActionState } from "react";
import Image from "next/image";
import { entrar, type AccesoState } from "@/app/actions/experiencia";
import type { ExperienciaContent } from "@/lib/content";
import { Rotulo, botonClases } from "./ui";

/** Pantalla de clave mientras la landing es solo para el equipo. */
export function Acceso({ acceso, configurada }: { acceso: ExperienciaContent["acceso"]; configurada: boolean }) {
  const [state, formAction, pending] = useActionState<AccesoState, FormData>(entrar, {});
  const error = state.error === "rate_limit" ? acceso.errorIntentos : state.error ? acceso.errorClave : null;

  return (
    <div className="flex min-h-[100svh] items-center py-16">
      <div className="container">
        <div className="mx-auto max-w-md">
          <Image src="/brand/logos/isotipo-color.png" alt="" width={464} height={433} className="h-10 w-auto" priority />
          <Rotulo className="mt-8 text-amarillo">{acceso.etiqueta}</Rotulo>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-[-0.02em] text-exp-crema sm:text-4xl">
            {acceso.titulo}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-exp-crema/75">{configurada ? acceso.texto : acceso.sinConfigurar}</p>

          {configurada && (
            <form action={formAction} className="mt-8">
              <label htmlFor="exp-clave" className="text-sm font-semibold text-exp-crema">
                {acceso.campo}
              </label>
              <input
                id="exp-clave"
                name="clave"
                type="password"
                required
                autoFocus
                autoComplete="off"
                aria-invalid={error ? true : undefined}
                aria-describedby="exp-clave-error"
                className="mt-2 w-full rounded-xl border border-exp-crema/25 bg-exp-noche px-4 py-3 text-base text-exp-crema focus:border-amarillo focus:outline-none focus:ring-2 focus:ring-amarillo/40"
              />
              <p id="exp-clave-error" role="alert" className="mt-2 min-h-[1.5rem] text-sm text-amarillo">
                {error}
              </p>
              <button type="submit" disabled={pending} className={botonClases("lleno", "mt-3 w-full disabled:opacity-70 sm:w-auto")}>
                {pending ? acceso.entrando : acceso.boton}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
