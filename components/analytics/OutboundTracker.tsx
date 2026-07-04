"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/tracking";

/**
 * Listener global de clics salientes.
 *
 * Detecta clics en links hacia destinos clave (WhatsApp, Instagram, Luma,
 * plataformas del podcast) y dispara eventos a GA4 + Vercel Analytics.
 * Estos eventos son los que se marcan como conversión en GA4 y se importan
 * a Google Ads (Ad Grants).
 *
 * Al ser un listener en document, cubre todos los links del sitio
 * (Server Components incluidos) sin tocar cada componente.
 */

const DESTINATIONS: readonly { pattern: RegExp; event: string }[] = [
  { pattern: /chat\.whatsapp\.com|wa\.me|api\.whatsapp\.com/, event: "join_whatsapp" },
  { pattern: /instagram\.com/, event: "click_instagram" },
  { pattern: /lu\.ma|luma\.com/, event: "event_signup" },
  { pattern: /open\.spotify\.com|youtube\.com|youtu\.be|podcasts\.apple\.com|music\.amazon/, event: "listen_podcast" }
];

export function OutboundTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.href;
      if (!/^https?:/.test(href)) return;

      const match = DESTINATIONS.find((d) => d.pattern.test(href));
      if (!match) return;

      trackEvent(match.event, {
        destino: href,
        pagina: window.location.pathname
      });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
