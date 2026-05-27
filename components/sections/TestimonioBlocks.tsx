"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";

import { Section } from "@/components/ui/Section";
import type { Testimonio } from "@/lib/content";

const borderCycle = [
  "border-verde-dark/30 bg-surface-card",
  "border-rosa/40 bg-surface-card",
  "border-violeta/40 bg-surface-card"
];
const accentText = ["text-verde-dark", "text-rosa-dark", "text-violeta-dark"];

function pickThree(all: Testimonio[], seed: number): Testimonio[] {
  const arr = [...all];
  const out: Testimonio[] = [];
  const rng = mulberry32(seed);
  while (out.length < 3 && arr.length > 0) {
    const i = Math.floor(rng() * arr.length);
    out.push(arr.splice(i, 1)[0]!);
  }
  return out;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function TestimonioBlocks({ testimonios }: { testimonios: Testimonio[] }) {
  const t = useTranslations("home.testimonios");
  const [seed, setSeed] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 100000));
    setHydrated(true);
  }, []);

  const tres = useMemo(() => pickThree(testimonios, seed), [testimonios, seed]);

  if (testimonios.length === 0) return null;

  return (
    <Section background="warm" ariaLabelledBy="testimonios-title" className="relative overflow-hidden py-20 md:py-24">
      <div className="flex items-end justify-between gap-4 mb-10 max-w-5xl mx-auto">
        <h2 id="testimonios-title" className="font-display text-2xl md:text-3xl font-extrabold leading-tight text-ink">
          {t("title")}
        </h2>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          aria-label="Cambiar testimonios"
          className="inline-flex items-center gap-2 rounded-full bg-surface-card border border-surface-line px-4 py-2 text-sm font-bold text-ink hover:border-verde-dark transition-colors"
          disabled={!hydrated}
        >
          <RefreshCw size={14} aria-hidden />
          Cambiar
        </button>
      </div>

      <ul className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
        {tres.map((tt, i) => (
          <li
            key={`${tt.id}-${seed}`}
            className={`relative rounded-3xl border-2 p-7 flex flex-col ${borderCycle[i % borderCycle.length]}`}
          >
            <span aria-hidden className={`font-bubbles text-5xl leading-none ${accentText[i % accentText.length]} opacity-30 select-none -mt-2`}>
              &ldquo;
            </span>
            <blockquote className="font-display text-base md:text-lg font-semibold leading-snug text-ink flex-1">
              {tt.fraseDestacada ?? tt.texto}
            </blockquote>
            <footer className="mt-5">
              <p className="font-semibold text-ink">
                {tt.autor ?? "Mensaje de la comunidad"}
              </p>
              {(tt.contexto ?? tt.ubicacion) && (
                <p className="text-sm text-ink-muted">{tt.contexto ?? tt.ubicacion}</p>
              )}
            </footer>
          </li>
        ))}
      </ul>
    </Section>
  );
}
