/**
 * Ilustración animada de la primera estación: el sonido sale de quien habla,
 * viaja por el aire, entra por la oreja, pasa por la cóclea y sigue por el
 * nervio auditivo hasta el cerebro.
 * Decorativa: el texto del panel ya cuenta lo mismo.
 * Con movimiento reducido queda quieta (las ondas se ven, no viajan).
 */

const ONDAS = [0, 0.6, 1.2, 1.8];

/** La cóclea: una espiral que arranca donde llega el sonido y se enrosca hacia adentro. */
const ESPIRAL = Array.from({ length: 64 }, (_, i) => {
  const t = (i / 63) * Math.PI * 5;
  const radio = 20 * Math.exp(-0.2 * t);
  return `${(288 + radio * Math.cos(Math.PI + t)).toFixed(1)},${(44 + radio * Math.sin(Math.PI + t)).toFixed(1)}`;
}).join(" ");

export function OndasOido() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 430 88"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-8 h-auto w-full max-w-md text-exp-crema"
    >
      {/* Quien habla */}
      <circle cx="12" cy="44" r="4.5" fill="var(--acento)" />

      {/* El sonido viaja por el aire */}
      <g transform="translate(26 44)" stroke="var(--acento)" strokeWidth="2">
        {ONDAS.map((demora, i) => (
          <path
            key={demora}
            d="M0 -16 Q9 0 0 16"
            // Quietas (movimiento reducido) quedan repartidas en el camino.
            transform={`translate(${i * 30} 0)`}
            className="opacity-60 [transform-box:fill-box] [transform-origin:center] motion-safe:animate-exp-onda motion-safe:[transform:none]"
            style={{ animationDelay: `${demora}s` }}
          />
        ))}
      </g>

      {/* La oreja */}
      <g transform="translate(150 8) scale(3)" stroke="currentColor" strokeWidth="0.7">
        <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" />
        <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" />
      </g>

      {/* Y sigue camino hacia adentro */}
      <path
        d="M214 44H264"
        stroke="var(--acento)"
        strokeWidth="2"
        strokeDasharray="2 6"
        className="motion-safe:animate-exp-flujo"
      />
      {/* La cóclea */}
      <polyline points={ESPIRAL} stroke="var(--acento)" strokeWidth="2" className="opacity-80" />

      {/* El nervio auditivo */}
      <path
        d="M314 44C326 44 330 38 342 38"
        stroke="var(--acento)"
        strokeWidth="2"
        strokeDasharray="2 6"
        className="motion-safe:animate-exp-flujo"
      />

      {/* El cerebro, donde el sonido se vuelve palabra */}
      <g transform="translate(350 8) scale(3)" stroke="currentColor" strokeWidth="0.7">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
        <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
        <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
        <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
        <path d="M6 18a4 4 0 0 1-1.967-.516" />
        <path d="M19.967 17.484A4 4 0 0 1 18 18" />
      </g>
    </svg>
  );
}
