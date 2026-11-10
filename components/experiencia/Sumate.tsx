"use client";

import { useActionState, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { anotarse, type AnotarseState } from "@/app/actions/experiencia";
import type { ExperienciaContent } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import { Bloque, botonClases } from "./ui";

/**
 * Formulario de la landing: tres maneras de sumarse. Guarda en Supabase y avisa
 * al equipo por mail (ver `app/actions/experiencia.ts`).
 */

type Sumate = ExperienciaContent["sumate"];
type Modo = Sumate["modos"][number]["id"];

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

export function Sumate({ sumate, url }: { sumate: Sumate; url: string }) {
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<AnotarseState, FormData>(anotarse, {});
  const [modo, setModo] = useState<Modo>(sumate.modos[0]?.id ?? "llevar");
  // Campos controlados: React vacía el formulario después de cada envío y, si
  // hubo un error, la persona no tiene que escribir todo de nuevo.
  const [valores, setValores] = useState<Record<string, string>>({});
  const montadoEn = useRef<number>(Date.now());
  const elapsedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    montadoEn.current = Date.now();
  }, []);

  const actual = sumate.modos.find((m) => m.id === modo);
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
      ? `mailto:${encodeURIComponent(state.emailDestino ?? "")}?subject=${encodeURIComponent(sumate.mensaje.asunto)}&body=${encodeURIComponent(
          sumate.mensaje.cuerpo.replace("{url}", url).replace("{nombre}", state.nombre ?? "")
        )}`
      : null;

  return (
    <Bloque id="sumate" titulo={sumate.titulo} intro={sumate.intro}>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
        <fieldset disabled={state.ok}>
          <legend className="sr-only">{sumate.intro}</legend>
          <div className="flex flex-col gap-3">
            {sumate.modos.map((m) => {
              const activo = m.id === modo;
              return (
                <label
                  key={m.id}
                  className={cn(
                    "cursor-pointer rounded-2xl border p-5 transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-amarillo",
                    activo ? "border-amarillo bg-exp-panel" : "border-exp-crema/15 hover:border-exp-crema/40"
                  )}
                >
                  <input
                    type="radio"
                    name="modo-visible"
                    value={m.id}
                    checked={activo}
                    onChange={() => setModo(m.id)}
                    className="sr-only"
                  />
                  <span className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1.5 h-3 w-3 shrink-0 rounded-full border",
                        activo ? "border-amarillo bg-amarillo" : "border-exp-crema/50"
                      )}
                    />
                    <span>
                      <span className="block font-display text-lg font-extrabold text-exp-crema">{m.titulo}</span>
                      <span className="mt-1 block leading-relaxed text-exp-crema/70">{m.texto}</span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {state.ok ? (
          <div role="status" className="rounded-2xl border border-amarillo/40 bg-exp-panel p-6 md:p-8">
            <p className="font-display text-2xl font-extrabold leading-snug text-exp-crema">
              {sumate.ok[state.modo ?? modo]}
            </p>
            {mailto && (
              <a href={mailto} className={botonClases("lleno", "mt-6")}>
                {sumate.mensaje.boton}
              </a>
            )}
          </div>
        ) : (
          <form
            action={formAction}
            onSubmit={() => {
              if (elapsedRef.current) elapsedRef.current.value = String(Date.now() - montadoEn.current);
            }}
            className="relative rounded-2xl border border-exp-crema/10 bg-exp-panel p-6 md:p-8"
          >
            <input type="hidden" name="modo" value={modo} />
            <input type="hidden" name="locale" value={locale} />
            <input ref={elapsedRef} type="hidden" name="elapsed" defaultValue="" />
            {/* Campo trampa: invisible para personas, lo completan los bots. */}
            <div className="absolute -left-[9999px] top-0" aria-hidden="true">
              <label>
                Sitio web
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="flex flex-col gap-5">
              <Campo etiqueta={c.nombre}>{(id) => <input id={id} required autoComplete="name" maxLength={120} {...enlazar("nombre")} />}</Campo>
              <Campo etiqueta={c.email}>
                {(id) => <input id={id} required type="email" autoComplete="email" inputMode="email" {...enlazar("email")} />}
              </Campo>
              <Campo etiqueta={c.ciudad} ayuda={c.ciudadAyuda}>
                {(id) => <input id={id} required autoComplete="address-level2" maxLength={120} {...enlazar("ciudad")} />}
              </Campo>

              {modo === "llevar" && (
                <Campo etiqueta={c.tipoEspacio}>
                  {(id) => (
                    <select id={id} {...enlazar("tipoEspacio")}>
                      <option value="">{c.elegir}</option>
                      {c.tiposEspacio.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  )}
                </Campo>
              )}

              {modo !== "avisar" && (
                <Campo etiqueta={c.organizacion}>
                  {(id) => <input id={id} autoComplete="organization" maxLength={160} {...enlazar("organizacion")} />}
                </Campo>
              )}

              {modo === "presentar" && (
                <Campo etiqueta={c.emailDestino} ayuda={c.emailDestinoAyuda}>
                  {(id) => <input id={id} type="email" inputMode="email" {...enlazar("emailDestino")} />}
                </Campo>
              )}

              <Campo etiqueta={c.vinculo}>
                {(id) => (
                  <select id={id} {...enlazar("vinculo")}>
                    <option value="">{c.elegir}</option>
                    {c.vinculos.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                )}
              </Campo>

              {modo !== "avisar" && (
                <Campo etiqueta={c.motivo}>{(id) => <textarea id={id} rows={3} maxLength={2000} {...enlazar("motivo")} />}</Campo>
              )}
            </div>

            <button type="submit" disabled={pending} className={botonClases("lleno", "mt-7 w-full disabled:opacity-70 sm:w-auto")}>
              {pending ? sumate.enviando : actual?.boton}
            </button>
            <p className="mt-4 text-sm text-exp-crema/60">{sumate.nota}</p>
            <p role="alert" className={cn("mt-3 leading-relaxed text-amarillo", !error && "sr-only")}>
              {error}
            </p>
          </form>
        )}
      </div>
    </Bloque>
  );
}
