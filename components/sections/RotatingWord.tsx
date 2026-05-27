"use client";

import { useEffect, useState } from "react";

/**
 * Cicla por un array de palabras con un fade vertical.
 * Útil para titulares tipo "Las personas que [sostienen / construyen / piensan] Casacusia".
 */
export function RotatingWord({
  words,
  intervalMs = 2400,
  className = ""
}: {
  words: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  if (words.length === 0) return null;

  return (
    <span className={`inline-grid grid-cols-1 align-baseline ${className}`}>
      {words.map((w, i) => (
        <span
          key={w}
          aria-hidden={i !== index}
          className={`col-start-1 row-start-1 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
