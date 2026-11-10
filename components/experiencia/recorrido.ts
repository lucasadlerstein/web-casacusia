/** Cuentas compartidas entre el fondo (lo que se ve) y el sonido (lo que se oye) del recorrido. */

export const mezclar = (a: number, b: number, t: number) => a + (b - a) * t;
export const acotar = (t: number) => Math.min(1, Math.max(0, t));
export const suave = (t: number) => t * t * (3 - 2 * t);

/** Posición continua en el recorrido: 2.4 = 40 % del camino entre el panel 2 y el 3. */
export function posicionEnRecorrido(paneles: HTMLElement[]): { indice: number; avance: number } {
  const centro = window.innerHeight / 2;
  const centros = paneles.map((p) => {
    const r = p.getBoundingClientRect();
    return r.top + r.height / 2 - centro;
  });
  if ((centros[0] ?? 0) >= 0) return { indice: 0, avance: 0 };
  for (let i = 0; i < centros.length - 1; i++) {
    const actual = centros[i] ?? 0;
    const proximo = centros[i + 1] ?? 0;
    if (actual <= 0 && proximo > 0) return { indice: i, avance: -actual / (proximo - actual) };
  }
  return { indice: centros.length - 1, avance: 0 };
}

/** Cuánto pesa el panel que entra: la mezcla se concentra en el tramo central entre dos paneles. */
export const mezclaEntrePaneles = (avance: number) => suave(acotar((avance - 0.25) / 0.5));
