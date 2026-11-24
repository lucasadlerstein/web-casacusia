"use client";

import { useActionState, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { anotarse, type AnotarseState } from "@/app/actions/experiencia";
import type { ExperienciaContent } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import { Preguntas } from "./Preguntas";
import { Bloque, botonClases } from "./ui";

/**
 * Formulario de la landing: tres maneras de sumarse. Guarda en Supabase y avisa
 * al equipo por mail (ver `app/actions/experiencia.ts`).
 */

type Sumate = ExperienciaContent["sumate"];
type PreguntasC = ExperienciaContent["preguntas"];

const campo =
  "mt-2 w-full rounded-xl border border-exp-crema/25 bg-exp-noche px-4 py-3 text-base text-exp-crema placeholder:text-exp-crema/40 " +
  "focus:border-amarillo focus:outline-none focus:ring-2 focus:ring-amarillo/40";

function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-exp-crema">
        {etiqueta}
      </label>
      {children(id)}
      {ayuda && <p className="mt-1.5 text-sm text-exp-crema/60">{ayuda}</p>}
    </div>
  );
}

/** El formulario en sí: uno solo, que pregunta qué querés hacer. Vive en la sección del final y en el pop-up. */
export function SumateFormulario({ sumate, url }: { sumate: Sumate; url: string }) {
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<AnotarseState, FormData>(anotarse, {});
  // Campos controlados: React vacía el formulario después de cada envío y, si
  // hubo un error, la persona no tiene que escribir todo de nuevo.
  const [valores, setValores] = useState<Record<string, string>>({ modo: sumate.modos[0]?.id ?? "llevar" });
  const montadoEn = useRef<number>(Date.now());
  const elapsedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    montadoEn.current = Date.now();
  }, []);

  const c = sumate.campos;
  const enlazar = (nombre: string) => ({
    name: nombre,
    value: valores[nombre] ?? "",
    onChange: (e: { target: { value: string } }) => setValores((v) => ({ ...v, [nombre]: e.target.value })),
    className: campo
  });

  const error =
    state.error === "undeliverable_email"
      ? sumate.errores.email
      : state.error === "validation_failed"
        ? sumate.errores.validacion
        : state.error === "rate_limit"
          ? sumate.errores.rate
          : state.error
            ? sumate.errores.generico
            : null;

  const mailto =
    state.ok && state.modo === "presentar"
      ? `mailto:?subject=${encodeURIComponent(sumate.mensaje.asunto)}&body=${encodeURIComponent(
          sumate.mensaje.cuerpo.replace("{url}", url).replace("{nombre}", state.nombre ?? "")
        )}`
      : null;

  if (state.ok) {
    return (
      <div role="status" className="mt-8 rounded-2xl border border-amarillo/40 bg-exp-panel p-6 md:p-8">
        <p className="font-display text-2xl font-extrabold leading-snug text-exp-crema">{sumate.ok[state.modo ?? "llevar"]}</p>
        {mailto && (
          <a href={mailto} className={botonClases("lleno", "mt-6")}>
            {sumate.mensaje.boton}
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={() => {
        if (elapsedRef.current) elapsedRef.current.value = String(Date.now() - montadoEn.current);
      }}
      className="relative mt-8 rounded-2xl border border-exp-crema/10 bg-exp-panel p-6 md:p-8"
    >
      <input type="hidden" name="locale" value={locale} />
      <input ref={elapsedRef} type="hidden" name="elapsed" defaultValue="" />
      {/* Campo trampa: invisible para personas, lo completan los bots. */}
      <div className="absolute -left-[9999px] top-0" aria-hidden="true">
        <label>
          Sitio web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Campo etiqueta={c.modo}>
            {(id) => (
              <select id={id} required {...enlazar("modo")}>
                {sumate.modos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.titulo}
                  </option>
                ))}
              </select>
            )}
          </Campo>
        </div>
        <Campo etiqueta={c.nombre}>{(id) => <input id={id} required autoComplete="given-name" maxLength={120} {...enlazar("nombre")} />}</Campo>
        <Campo etiqueta={c.apellido}>{(id) => <input id={id} required autoComplete="family-name" maxLength={120} {...enlazar("apellido")} />}</Campo>
        <div className="sm:col-span-2">
          <Campo etiqueta={c.email}>
            {(id) => <input id={id} required type="email" autoComplete="email" inputMode="email" {...enlazar("email")} />}
          </Campo>
        </div>
        <Campo etiqueta={c.ciudad}>{(id) => <input id={id} required autoComplete="address-level2" maxLength={120} {...enlazar("ciudad")} />}</Campo>
        <Campo etiqueta={c.pais}>{(id) => <input id={id} required autoComplete="country-name" maxLength={80} {...enlazar("pais")} />}</Campo>
        <div className="sm:col-span-2">
          <Campo etiqueta={c.organizacion}>
            {(id) => <input id={id} autoComplete="organization" maxLength={160} {...enlazar("organizacion")} />}
          </Campo>
        </div>
        <div className="sm:col-span-2">
          <Campo etiqueta={c.motivo}>{(id) => <textarea id={id} rows={3} maxLength={2000} {...enlazar("motivo")} />}</Campo>
        </div>
      </div>

      <button type="submit" disabled={pending} className={botonClases("lleno", "mt-7 w-full disabled:opacity-70 sm:w-auto")}>
        {pending ? sumate.enviando : sumate.boton}
      </button>
      <p className="mt-4 text-sm text-exp-crema/60">{sumate.nota}</p>
      <p role="alert" className={cn("mt-3 leading-relaxed text-amarillo", !error && "sr-only")}>
        {error}
      </p>
    </form>
  );
}

/** La sección del final, para quien llega scrolleando (y para Google). */
export function Sumate({ sumate, url, preguntas }: { sumate: Sumate; url: string; preguntas: PreguntasC }) {
  return (
    <Bloque id="sumate" titulo={sumate.titulo} intro={sumate.intro}>
      <SumateFormulario sumate={sumate} url={url} />
      <Preguntas preguntas={preguntas} />
    </Bloque>
  );
}

export const SUMATE_DIALOGO_ID = "sumate-dialogo";

/**
 * El mismo formulario como pop-up: se abre desde cualquier botón «Llevarla a
 * mi espacio» (ver `BotonSumate`), para darle a ese pedido su propio momento.
 */
export function SumateDialogo({ sumate, url, preguntas }: { sumate: Sumate; url: string; preguntas: PreguntasC }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  return (
    <dialog
      ref={dialogo}
      id={SUMATE_DIALOGO_ID}
      aria-labelledby={`${SUMATE_DIALOGO_ID}-titulo`}
      className="m-auto max-h-[calc(100svh-2rem)] w-[calc(100%-1.5rem)] max-w-5xl overflow-y-auto rounded-3xl border border-exp-crema/15 bg-exp-noche p-5 text-exp-crema shadow-2xl backdrop:bg-exp-noche/85 backdrop:backdrop-blur-sm sm:p-8 md:p-10"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={`${SUMATE_DIALOGO_ID}-titulo`} className="font-display text-2xl font-extrabold leading-tight text-exp-crema sm:text-3xl md:text-4xl">
            {sumate.titulo}
          </h2>
          <p className="mt-2 text-exp-crema/75">{sumate.intro}</p>
        </div>
        <button
          type="button"
          onClick={() => dialogo.current?.close()}
          aria-label={sumate.cerrar}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-exp-crema/30 text-2xl leading-none text-exp-crema hover:bg-exp-crema/10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-amarillo"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <SumateFormulario sumate={sumate} url={url} />
      <Preguntas preguntas={preguntas} />
    </dialog>
  );
}
