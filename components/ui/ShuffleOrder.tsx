"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Mezcla el orden visual de sus hijos en cada carga de página.
 *
 * El HTML del servidor mantiene el orden determinista (sirve para SEO y para
 * quien navegue sin JS) y recién después del montaje se reordena con la
 * propiedad `order` de CSS: no hay hydration mismatch, no se vuelven a pedir
 * las imágenes y no hay salto visible.
 *
 * Requiere que el contenedor sea flex o grid (donde `order` tiene efecto).
 */
export function ShuffleOrder({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = Array.from(ref.current?.children ?? []) as HTMLElement[];
    if (items.length < 2) return;

    // Fisher-Yates (variante inside-out): una permutación uniforme de 0..n-1.
    const posiciones: number[] = [];
    for (let i = 0; i < items.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      posiciones[i] = posiciones[j] ?? i;
      posiciones[j] = i;
    }

    items.forEach((item, i) => {
      item.style.order = String(posiciones[i]);
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
