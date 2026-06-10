"use client";

import { useState, useEffect } from "react";
import { Linkedin } from "lucide-react";
import { MiembroEquipo } from "@/lib/content";

export function TeamGridInteractive({ initialEquipo }: { initialEquipo: MiembroEquipo[] }) {
  const [equipo, setEquipo] = useState<MiembroEquipo[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Initial random shuffle on client to avoid hydration mismatch
    const shuffled = [...initialEquipo].sort(() => Math.random() - 0.5);
    // Show only 6 random members at a time to keep the layout compact and allow swapping
    setEquipo(shuffled.slice(0, 6));

    const interval = setInterval(() => {
      setTick(t => t + 1);
      setEquipo(() => {
        const nextShuffled = [...initialEquipo].sort(() => Math.random() - 0.5);
        return nextShuffled.slice(0, 6);
      });
    }, 8000); // 8 seconds gives enough time to read before swapping

    return () => clearInterval(interval);
  }, [initialEquipo]);

  // Fallback for SSR
  const displayEquipo = equipo.length > 0 ? equipo : initialEquipo.slice(0, 6);

  return (
    <div key={tick} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-1000 zoom-in-95">
      {displayEquipo.map((m) => (
        <div key={m.slug} className="rounded-2xl bg-surface-card border border-surface-line p-6 flex flex-col hover:shadow-card-hover transition-all duration-300">
          <div className="h-16 w-16 rounded-full bg-brand-teal-soft flex items-center justify-center text-brand-teal-dark font-display font-bold text-2xl">
            {m.nombre.charAt(0)}
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">
            {m.nombre} {m.apellido}
          </h3>
          <p className="text-brand-teal-dark text-sm font-medium mt-0.5">{m.rol}</p>
          <p className="mt-3 text-ink-soft leading-relaxed flex-1 text-sm">{m.bioCorta}</p>
          {m.quotePersonal && (
            <blockquote className="mt-4 pl-4 border-l-2 border-brand-teal italic text-ink-soft text-sm">
              “{m.quotePersonal}”
            </blockquote>
          )}
          {m.linkedin && (
            <a
              href={m.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-brand-teal"
              aria-label={`LinkedIn de ${m.nombre}`}
            >
              <Linkedin size={16} aria-hidden /> LinkedIn
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
