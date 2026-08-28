"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import {
  EXPO_HIPOACUSIA_CAMPAIGN_START,
  EXPO_HIPOACUSIA_CAMPAIGN_END,
  EXPO_HIPOACUSIA_REGISTER_URL
} from "@/lib/campaigns/expoHipoacusia";

const ROTATE_MS = 7000;
const FADE_MS = 300;

export function ExpoHipoacusiaBanner() {
  const t = useTranslations("expoBanner");
  const mensajes = t.raw("mensajes") as string[];
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const now = new Date();
    setActive(now >= EXPO_HIPOACUSIA_CAMPAIGN_START && now < EXPO_HIPOACUSIA_CAMPAIGN_END);
  }, []);

  useEffect(() => {
    if (!active || mensajes.length < 2) return;
    let swapTimeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);
      swapTimeout = setTimeout(() => {
        setIndex((i) => (i + 1) % mensajes.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(swapTimeout);
    };
  }, [active, mensajes.length]);

  if (!active) return null;

  return (
    <a
      href={EXPO_HIPOACUSIA_REGISTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("expo_hipoacusia_banner_click")}
      className="group flex items-center justify-center gap-2 bg-amatista px-4 py-2.5 text-center text-ink transition-[filter] hover:brightness-95"
    >
      <span
        className={`text-sm font-bold transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {mensajes[index]}
      </span>
      <ArrowRight
        size={16}
        className="shrink-0 text-ink transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </a>
  );
}
