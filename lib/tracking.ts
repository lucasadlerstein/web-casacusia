/**
 * Custom event tracking.
 *
 * Fires to both Vercel Analytics (track) and GA4 (gtag) when available.
 * Safe to call server-side (no-ops silently).
 */

import { track as vercelTrack } from "@vercel/analytics";

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, props?: EventProps) {
  if (typeof window === "undefined") return;

  // Vercel Analytics
  try {
    vercelTrack(name, props);
  } catch {
    // silently ignore
  }

  // GA4
  if (window.gtag) {
    window.gtag("event", name, props);
  }
}
