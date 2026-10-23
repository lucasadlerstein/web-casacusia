"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import { X } from "lucide-react";
import { useLocale } from "next-intl";

import type { AlaParContent } from "@/lib/content";
import { sumarseAEspera, type EsperaState } from "@/app/actions/alapar";
import { alaParButtonClasses, type AlaParSize, type AlaParVariant } from "./AlaParButton";

type ModalContent = AlaParContent["modal"];

const Ctx = createContext<{ abrir: () => void } | null>(null);

/** Botón que abre el modal de lista de espera. Mismo look que AlaParButton. */
export function AcompanamientoButton({
  variant = "cereza",
  size = "md",
  className,
  children
}: {
  variant?: AlaParVariant;
  size?: AlaParSize;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(Ctx);
  return (
    <button type="button" onClick={ctx?.abrir} className={alaParButtonClasses(variant, size, className)}>
      {children}
    </button>
  );
}

/**
 * Provee el modal de "Quiero acompañamiento": mientras no haya Pares formados,
 * la persona deja su email y se la invita a los encuentros.
 * Usa <dialog> nativo: foco atrapado, Esc cierra, fondo bloqueado.
 */
export function AcompanamientoProvider({ modal, children }: { modal: ModalContent; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [abierto, setAbierto] = useState(false);

  const abrir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (!el.open) el.showModal();
    setAbierto(true);
  }, []);

  const cerrar = useCallback(() => {
    ref.current?.close();
  }, []);

  return (
    <Ctx.Provider value={{ abrir }}>
      {children}
      <dialog
        ref={ref}
        onClose={() => setAbierto(false)}
        onClick={(e) => {
          // Clic en el fondo (fuera del panel) cierra.
          if (e.target === e.currentTarget) cerrar();
        }}
        aria-labelledby="alapar-modal-titulo"
        className="m-auto w-[min(92vw,34rem)] rounded-[2rem] bg-alapar-crema p-0 text-ink shadow-[0_40px_90px_-30px_rgba(110,19,53,0.6)] backdrop:bg-alapar-cereza-deep/70 backdrop:backdrop-blur-sm open:animate-[alapar-rise_300ms_var(--ease-out)_both]"
      >
        {abierto && <ModalBody modal={modal} cerrar={cerrar} />}
      </dialog>
    </Ctx.Provider>
  );
}

function ModalBody({ modal, cerrar }: { modal: ModalContent; cerrar: () => void }) {
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<EsperaState, FormData>(sumarseAEspera, {});
  const montadoEn = useRef<number>(Date.now());
  /* El tiempo de llenado se escribe directo en el input oculto al enviar:
     React arma el FormData después de onSubmit, así que el valor viaja. */
  const elapsedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    montadoEn.current = Date.now();
  }, []);

  const errorMsg =
    state.error === "undeliverable_email" || state.error === "validation_failed"
      ? modal.errores.email
      : state.error === "rate_limit"
        ? modal.errores.rate
        : state.error
          ? modal.errores.generico
          : null;

  return (
    <div className="relative px-6 pb-6 pt-7 sm:px-8 sm:pb-8">
      <button
        type="button"
        onClick={cerrar}
        aria-label={modal.cerrar}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-alapar-cereza/10 hover:text-alapar-cereza"
      >
        <X size={20} aria-hidden="true" />
      </button>

      <span className="flex -space-x-1" aria-hidden="true">
        <span className="h-3 w-3 rounded-full bg-alapar-naranja" />
        <span className="h-3 w-3 rounded-full bg-alapar-rosa" />
      </span>

      {state.ok ? (
        <div className="mt-4">
          <h2 id="alapar-modal-titulo" className="font-onest text-2xl font-extrabold leading-tight text-alapar-cereza sm:text-[1.9rem]">
            {modal.gracias.titulo}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">{modal.gracias.texto}</p>
          <div className="mt-6">
            <button type="button" onClick={cerrar} className={alaParButtonClasses("cereza", "lg")}>
              {modal.cerrar}
            </button>
          </div>
        </div>
      ) : (
        <form
          action={formAction}
          onSubmit={() => {
            if (elapsedRef.current) elapsedRef.current.value = String(Date.now() - montadoEn.current);
          }}
          className="mt-4"
          noValidate
        >
          <h2 id="alapar-modal-titulo" className="pr-10 font-onest text-2xl font-extrabold leading-tight text-alapar-cereza sm:text-[1.9rem]">
            {modal.titulo}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">{modal.texto}</p>

          <input type="hidden" name="locale" value={locale} />
          <input ref={elapsedRef} type="hidden" name="elapsed" defaultValue="" />
          {/* Campo trampa: invisible para personas, lo completan los bots. */}
          <div className="absolute -left-[9999px] top-0" aria-hidden="true">
            <label>
              Sitio web
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">{modal.labelNombre}</span>
              <input
                type="text"
                name="nombre"
                maxLength={120}
                autoComplete="name"
                className="h-12 w-full rounded-xl border border-alapar-cereza/20 bg-white px-4 text-base text-ink outline-none transition-colors focus:border-alapar-cereza focus:ring-4 focus:ring-alapar-rosa/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">{modal.labelEmail}</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder={modal.placeholderEmail}
                aria-invalid={errorMsg ? true : undefined}
                className="h-12 w-full rounded-xl border border-alapar-cereza/20 bg-white px-4 text-base text-ink outline-none transition-colors focus:border-alapar-cereza focus:ring-4 focus:ring-alapar-rosa/20"
              />
            </label>
            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-ink">{modal.labelParaQuien}</legend>
              <div className="flex flex-wrap gap-2">
                {modal.opciones.map((op, i) => (
                  <label
                    key={op.value}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-alapar-cereza/20 bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition-colors has-[:checked]:border-alapar-cereza has-[:checked]:bg-alapar-cereza has-[:checked]:text-alapar-crema"
                  >
                    <input type="radio" name="paraQuien" value={op.value} defaultChecked={i === 0} className="sr-only" />
                    {op.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {errorMsg && (
            <p role="alert" className="mt-4 rounded-xl bg-alapar-rosa-soft px-4 py-3 text-sm font-semibold text-alapar-cereza">
              {errorMsg}
            </p>
          )}

          <div className="mt-6">
            <button type="submit" disabled={pending} className={alaParButtonClasses("cereza", "lg")}>
              {pending ? modal.enviando : modal.cta}
            </button>
          </div>
          <p className="mt-4 text-xs text-ink-muted">{modal.privacidad}</p>
        </form>
      )}
    </div>
  );
}
