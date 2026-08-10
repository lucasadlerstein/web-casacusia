"use client";

import { useActionState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { submitContact, type ContactState } from "@/app/[locale]/contacto/actions";
import { useRouter } from "@/lib/i18n/navigation";

const initial: ContactState = {};

const inputBase =
  "w-full h-11 px-4 rounded-lg bg-surface-card border border-surface-line focus:border-brand-teal focus:outline-none focus:ring-4 focus:ring-brand-teal/30";
const textareaBase =
  "w-full p-4 rounded-lg bg-surface-card border border-surface-line focus:border-brand-teal focus:outline-none focus:ring-4 focus:ring-brand-teal/30";

export function ContactForm({ initialType = "personal" }: { initialType?: string }) {
  const t = useTranslations("contacto.form");
  const router = useRouter();

  /** Momento en que el form quedó montado, para medir cuánto tardó el envío.
   *  Un submit instantáneo es señal de automatización. */
  const mountedAt = useRef<number | null>(null);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const action = useCallback(async (prev: ContactState, formData: FormData) => {
    if (mountedAt.current !== null) {
      formData.set("elapsed", String(Date.now() - mountedAt.current));
    }
    return submitContact(prev, formData);
  }, []);

  const [state, formAction, isPending] = useActionState(action, initial);

  const errClass = " border-feedback-warn focus:border-feedback-warn focus:ring-feedback-warn/30";
  const fieldClass = (field: string, base: string) =>
    state.fieldErrors?.[field] ? base + errClass : base;

  useEffect(() => {
    if (state.ok) {
      router.push("/gracias");
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="relative grid gap-5" noValidate>
      <label className="block">
        <span className="block text-sm font-medium mb-1">{t("type")}</span>
        <select name="type" defaultValue={state.values?.type || initialType} required className={inputBase}>
          <option value="personal">{t("types.personal")}</option>
          <option value="voluntariado">{t("types.voluntariado")}</option>
          <option value="prensa">{t("types.prensa")}</option>
          <option value="empresa">{t("types.empresa")}</option>
          <option value="profesional">{t("types.profesional")}</option>
          <option value="otro">{t("types.otro")}</option>
        </select>
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-medium mb-1">{t("name")}</span>
          <input type="text" name="name" required autoComplete="name" minLength={2} defaultValue={state.values?.name} className={fieldClass("name", inputBase)} />
          {state.fieldErrors?.name ? (
            <span className="block text-xs text-feedback-warn mt-1" role="alert">
              {state.fieldErrors.name}
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1">{t("email")}</span>
          <input type="email" name="email" required autoComplete="email" defaultValue={state.values?.email} className={fieldClass("email", inputBase)} />
          {state.fieldErrors?.email ? (
            <span className="block text-xs text-feedback-warn mt-1" role="alert">
              {state.fieldErrors.email}
            </span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-medium mb-1">{t("phone")}</span>
          <input type="tel" name="phone" autoComplete="tel" defaultValue={state.values?.phone} className={inputBase} />
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1">{t("location")}</span>
          <input type="text" name="location" autoComplete="address-level2" defaultValue={state.values?.location} className={inputBase} />
        </label>
      </div>

      <label className="block">
        <span className="block text-sm font-medium mb-1">{t("message")}</span>
        <textarea name="message" required minLength={10} rows={5} defaultValue={state.values?.message} className={fieldClass("message", textareaBase)} />
        {state.fieldErrors?.message ? (
          <span className="block text-xs text-feedback-warn mt-1" role="alert">
            {state.fieldErrors.message}
          </span>
        ) : null}
      </label>

      <label className="block">
        <span className="block text-sm font-medium mb-1">{t("howFound")}</span>
        <input type="text" name="howFound" defaultValue={state.values?.howFound} className={inputBase} />
      </label>

      {/* Honeypots. Dos trampas complementarias:
          - "website" con display:none, atrapa bots que no interpretan CSS.
          - "organizacion_url" fuera de pantalla pero visible para el motor de
            render, atrapa bots que descartan lo que está en display:none.
          Ambos quedan fuera del foco y del árbol de accesibilidad. */}
      <label className="hidden" aria-hidden="true">
        <span>Website</span>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          <span>Sitio de tu organización</span>
          <input type="text" name="organizacion_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="consent"
            value="on"
            required
            className={state.fieldErrors?.consent ? "mt-0.5 accent-feedback-warn" : "mt-0.5"}
          />
          <span>{t("consent")}</span>
        </label>
        {state.fieldErrors?.consent ? (
          <span className="block text-xs text-feedback-warn mt-1 ml-6" role="alert">
            Necesitamos tu consentimiento para poder responderte.
          </span>
        ) : null}
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="newsletter" value="on" className="mt-0.5" />
        <span>{t("newsletter")}</span>
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enviando…" : t("submit")}
        </Button>
        {state.ok ? (
          <p role="status" className="text-feedback-ok text-sm">
            {t("success")}
          </p>
        ) : null}
        {state.error === "rate_limit" ? (
          <p role="alert" className="text-feedback-warn text-sm">
            Demasiados intentos. Esperá un momento e intentá de nuevo.
          </p>
        ) : null}
        {state.error === "validation_failed" ? (
          <p role="alert" className="text-feedback-warn text-sm">
            Revisá los campos marcados.
          </p>
        ) : null}
        {state.error === "send_failed" ? (
          <p role="alert" className="text-feedback-warn text-sm">
            {t("error")}
          </p>
        ) : null}
      </div>
    </form>
  );
}
