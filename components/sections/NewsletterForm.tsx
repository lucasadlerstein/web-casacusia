"use client";

import { useActionState, useCallback, useEffect, useRef } from "react";
import { Mail } from "lucide-react";
import { suscribirNewsletter, type Result } from "@/app/actions/newsletter";

type Props = {
  labels: {
    titulo: string;
    subtitulo: string;
    nombre: string;
    email: string;
    boton: string;
    exito: string;
  };
};

export function NewsletterForm({ labels }: Props) {
  /** Momento en que el form quedó montado: un envío instantáneo es un bot. */
  const mountedAt = useRef<number | null>(null);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const submit = useCallback(async (prev: Result | null, formData: FormData) => {
    if (mountedAt.current !== null) {
      formData.set("elapsed", String(Date.now() - mountedAt.current));
    }
    return suscribirNewsletter(prev, formData);
  }, []);

  const [state, action, pending] = useActionState(submit, null);

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-verde-soft border border-verde/20 p-8 text-center">
        <p className="font-display text-xl font-extrabold text-verde-dark">{labels.exito}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-surface-tint border border-surface-line p-6 md:p-8">
      <div className="flex items-center gap-2 mb-2">
        <Mail size={20} className="text-verde-dark" aria-hidden />
        <h3 className="font-display text-lg font-extrabold text-ink">{labels.titulo}</h3>
      </div>
      <p className="text-sm text-ink-soft mb-5">{labels.subtitulo}</p>

      <form action={action} className="relative space-y-3">
        {/* Honeypots. Dos trampas complementarias: una invisible por opacidad y
            otra fuera de pantalla, para cubrir bots que descarten cada caso.
            Ambas quedan fuera del foco y del árbol de accesibilidad. */}
        <input
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute opacity-0 h-0 w-0 pointer-events-none"
        />
        <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>
            <span>Sitio de tu organización</span>
            <input type="text" name="organizacion_url" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <input
          type="text"
          name="nombre"
          required
          placeholder={labels.nombre}
          className="w-full rounded-xl border border-surface-line bg-surface-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-verde/40 focus:border-verde transition-colors"
        />
        <input
          type="email"
          name="email"
          required
          placeholder={labels.email}
          className="w-full rounded-xl border border-surface-line bg-surface-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-verde/40 focus:border-verde transition-colors"
        />

        {state && !state.ok && (
          <p className="text-sm text-rosa font-medium">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-verde-dark text-white px-4 py-2.5 text-sm font-bold hover:bg-[#0a6b42] transition-colors disabled:opacity-60"
        >
          {pending ? "..." : labels.boton}
        </button>
      </form>
    </div>
  );
}
