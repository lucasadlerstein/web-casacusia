"use client";

import { useActionState, useEffect } from "react";
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
  const [state, formAction, isPending] = useActionState(submitContact, initial);

  useEffect(() => {
    if (state.ok) {
      router.push("/gracias");
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <label className="block">
        <span className="block text-sm font-medium mb-1">{t("type")}</span>
        <select name="type" defaultValue={initialType} required className={inputBase}>
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
          <input type="text" name="name" required autoComplete="name" minLength={2} className={inputBase} />
          {state.fieldErrors?.name ? (
            <span className="block text-xs text-feedback-warn mt-1" role="alert">
              {state.fieldErrors.name}
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1">{t("email")}</span>
          <input type="email" name="email" required autoComplete="email" className={inputBase} />
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
          <input type="tel" name="phone" autoComplete="tel" className={inputBase} />
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1">{t("location")}</span>
          <input type="text" name="location" autoComplete="address-level2" className={inputBase} />
        </label>
      </div>

      <label className="block">
        <span className="block text-sm font-medium mb-1">{t("message")}</span>
        <textarea name="message" required minLength={10} rows={5} className={textareaBase} />
        {state.fieldErrors?.message ? (
          <span className="block text-xs text-feedback-warn mt-1" role="alert">
            {state.fieldErrors.message}
          </span>
        ) : null}
      </label>

      <label className="block">
        <span className="block text-sm font-medium mb-1">{t("howFound")}</span>
        <input type="text" name="howFound" className={inputBase} />
      </label>

      {/* Honeypot */}
      <label className="hidden" aria-hidden>
        <span>Website</span>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consent" value="on" required className="mt-0.5" />
        <span>{t("consent")}</span>
      </label>

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
