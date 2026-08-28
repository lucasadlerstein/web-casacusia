"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar, MapPin, X } from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import {
  EXPO_HIPOACUSIA_CAMPAIGN_START as CAMPAIGN_START,
  EXPO_HIPOACUSIA_CAMPAIGN_END as CAMPAIGN_END,
  EXPO_HIPOACUSIA_REGISTER_URL as REGISTER_URL
} from "@/lib/campaigns/expoHipoacusia";

const DISMISSED_KEY = "expo-hipoacusia-modal-dismissed";
const SHOW_DELAY_MS = 5000;

export function ExpoHipoacusiaModal() {
  const t = useTranslations("expoModal");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    if (now < CAMPAIGN_START || now >= CAMPAIGN_END) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const timer = setTimeout(() => {
      setOpen(true);
      trackEvent("expo_hipoacusia_modal_shown");
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleDismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleDismiss() {
    setOpen(false);
    sessionStorage.setItem(DISMISSED_KEY, "true");
  }

  function handleRegister() {
    trackEvent("expo_hipoacusia_modal_click");
    sessionStorage.setItem(DISMISSED_KEY, "true");
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="expo-hipoacusia-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl bg-surface-bg p-7 md:p-9 shadow-2xl">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Cerrar"
          className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-surface-tint hover:text-ink"
        >
          <X size={18} aria-hidden />
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-amatista-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
          {t("eyebrow")}
        </span>

        <h3
          id="expo-hipoacusia-title"
          className="mt-4 font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight pr-8"
        >
          {t("title")}
        </h3>

        <ul className="mt-5 space-y-2.5 text-ink-soft">
          <li className="flex items-start gap-2.5">
            <Calendar size={18} className="mt-0.5 shrink-0 text-verde-dark" aria-hidden />
            <span>{t("fecha")}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <MapPin size={18} className="mt-0.5 shrink-0 text-verde-dark" aria-hidden />
            <span>{t("lugar")}</span>
          </li>
        </ul>

        <p className="mt-4 text-ink-soft">{t("body")}</p>
        <p className="mt-2 text-sm text-ink-muted">{t("modalidad")}</p>

        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleRegister}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-verde-dark px-6 py-3 text-base font-bold text-white shadow-md transition-colors hover:bg-verde"
        >
          {t("cta")}
        </a>
      </div>
    </div>
  );
}
