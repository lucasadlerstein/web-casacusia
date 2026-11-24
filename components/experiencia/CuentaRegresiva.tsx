"use client";

import { useEffect, useState } from "react";

/**
 * Días que faltan hasta la próxima vez que llega esta fecha (mes-día).
 * Se calcula en el navegador: en el HTML del servidor no hay número, así
 * nunca queda una cuenta vieja guardada en caché.
 */
export function CuentaRegresiva({ fecha, faltan, hoy }: { fecha: string; faltan: string; hoy: string }) {
  const [dias, setDias] = useState<number | null>(null);

  useEffect(() => {
    const [mes, dia] = fecha.split("-").map(Number);
    if (!mes || !dia) return;
    const ahora = new Date();
    const hoy0 = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    let objetivo = new Date(ahora.getFullYear(), mes - 1, dia);
    if (objetivo < hoy0) objetivo = new Date(ahora.getFullYear() + 1, mes - 1, dia);
    setDias(Math.round((objetivo.getTime() - hoy0.getTime()) / 86_400_000));
  }, [fecha]);

  if (dias === null) return <span className="invisible">0</span>;
  if (dias === 0) return <span>{hoy}</span>;
  return (
    <span>
      {faltan.replace("{n}", "")}
      <span className="font-display text-[1.6em] font-extrabold tabular-nums leading-none">{dias}</span>{" "}
      {dias === 1 ? "día" : "días"}
    </span>
  );
}
