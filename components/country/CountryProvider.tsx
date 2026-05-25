"use client";

import { createContext, useCallback, useContext, useState, useTransition, type ReactNode } from "react";
import { setCountryOverride } from "@/app/actions/country";
import type { CountryCode } from "@/lib/country";

type CountryContextValue = {
  /** Código ISO-2 detectado (cookie > Vercel header). null si no se pudo determinar. */
  country: CountryCode | null;
  /** Cambia el override de país (persiste cookie). */
  setCountry: (code: CountryCode | null) => void;
  /** True si la fuente del valor actual es el override manual del usuario. */
  isOverride: boolean;
  /** True mientras la acción server está corriendo. */
  pending: boolean;
};

const CountryContext = createContext<CountryContextValue | null>(null);

export function CountryProvider({
  initialCountry,
  initialOverride,
  children
}: {
  initialCountry: CountryCode | null;
  initialOverride: boolean;
  children: ReactNode;
}) {
  const [country, setCountryState] = useState<CountryCode | null>(initialCountry);
  const [isOverride, setIsOverride] = useState(initialOverride);
  const [pending, startTransition] = useTransition();

  const setCountry = useCallback((code: CountryCode | null) => {
    setCountryState(code);
    setIsOverride(code !== null);
    startTransition(async () => {
      await setCountryOverride(code);
    });
  }, []);

  return (
    <CountryContext.Provider value={{ country, setCountry, isOverride, pending }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry(): CountryContextValue {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    // Si el provider no está, devolvemos un fallback inerte — la página no rompe.
    return { country: null, setCountry: () => {}, isOverride: false, pending: false };
  }
  return ctx;
}
