/**
 * Misceláneas del manual de marca de A la Par, dibujadas como SVG inline:
 * estallido, arcoíris, anillos y chevrons. Siempre decorativas (aria-hidden).
 */
import { cn } from "@/lib/utils/cn";

type DecoProps = { className?: string };

export function Estallido({ className }: DecoProps) {
  const rays = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("pointer-events-none", className)}>
      {rays.map((deg) => (
        <line
          key={deg}
          x1="50" y1="50" x2="50" y2="6"
          stroke="currentColor" strokeWidth="4" strokeLinecap="round"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
    </svg>
  );
}

export function Arcos({ className }: DecoProps) {
  return (
    <svg viewBox="0 0 100 56" aria-hidden="true" className={cn("pointer-events-none", className)}>
      {[46, 36, 26, 16].map((r) => (
        <path
          key={r}
          d={`M ${50 - r} 52 A ${r} ${r} 0 0 1 ${50 + r} 52`}
          fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function Anillos({ className }: DecoProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("pointer-events-none", className)}>
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.7" />
      <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.45" />
    </svg>
  );
}

export function Chevrons({ className, count = 4 }: DecoProps & { count?: number }) {
  return (
    <svg viewBox={`0 0 ${count * 26 + 10} 44`} aria-hidden="true" className={cn("pointer-events-none", className)}>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={`M ${6 + i * 26} 4 L ${24 + i * 26} 22 L ${6 + i * 26} 40`}
          fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/** Marca de agua con las dos figuras del isologo, para fondos. */
export function Figuras({ className }: DecoProps) {
  return (
    <svg viewBox="0 0 877 449" aria-hidden="true" className={cn("pointer-events-none", className)}>
      <image href="/alapar/pares.png" width="877" height="449" />
    </svg>
  );
}
