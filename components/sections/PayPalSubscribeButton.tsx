"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const SDK_SRC = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&vault=true&intent=subscription`;

let sdkPromise: Promise<void> | null = null;

/* eslint-disable @typescript-eslint/no-explicit-any -- PayPal SDK is untyped */
type PayPalWindow = Window & { paypal?: { Buttons: (opts: any) => { render: (el: HTMLElement) => void } } };

/** Carga el SDK de PayPal una sola vez (lazy). */
function loadSdk(): Promise<void> {
  if (sdkPromise) return sdkPromise;
  if (typeof window !== "undefined" && (window as PayPalWindow).paypal) {
    sdkPromise = Promise.resolve();
    return sdkPromise;
  }
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("PayPal SDK failed to load"));
    document.head.appendChild(script);
  });
  return sdkPromise;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

type Props = {
  planId: string;
  onSuccess?: () => void;
};

/**
 * Renderiza el botón oficial de PayPal Subscribe.
 * Se destruye y re-crea cada vez que cambia el planId.
 */
export function PayPalSubscribeButton({ planId, onSuccess }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const render = useCallback(async () => {
    if (!containerRef.current || !CLIENT_ID) return;
    setLoading(true);
    setError(false);

    try {
      await loadSdk();
      const paypal = (window as PayPalWindow).paypal;
      if (!paypal?.Buttons) throw new Error("PayPal Buttons not available");

      containerRef.current.innerHTML = "";

      paypal.Buttons({
        style: {
          shape: "pill",
          color: "gold",
          layout: "horizontal",
          label: "subscribe",
          height: 45
        },
        createSubscription: (_data: unknown, actions: { subscription: { create: (opts: { plan_id: string }) => Promise<string> } }) =>
          actions.subscription.create({ plan_id: planId }),
        onApprove: () => {
          onSuccess?.();
        },
        onError: () => {
          setError(true);
        }
      }).render(containerRef.current);

      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [planId, onSuccess]);

  useEffect(() => {
    render();
  }, [render]);

  if (!CLIENT_ID) return null;

  return (
    <div className="mt-5">
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-verde-dark" />
          <span className="ml-2 text-sm text-ink-muted">Cargando PayPal…</span>
        </div>
      )}
      {error && (
        <p className="text-sm text-rosa-dark text-center py-3">
          No pudimos cargar PayPal. Probá recargar la página.
        </p>
      )}
      <div ref={containerRef} className={loading ? "hidden" : ""} />
    </div>
  );
}
