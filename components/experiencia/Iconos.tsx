import type { ExperienciaIcono } from "@/lib/content";

/** Íconos de línea, sencillos, dibujados con el acento de cada sección. */
const TRAZOS: Record<ExperienciaIcono, string> = {
  empresa: "M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 9h5a1 1 0 0 1 1 1v11M4 21h16M8 8h2M8 12h2M8 16h2M17 13h1M17 17h1",
  escuela: "M3 9l9-4 9 4-9 4-9-4zM7 11v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5M21 9v6",
  gobierno: "M3 9l9-5 9 5H3zM5 9v9M10 9v9M14 9v9M19 9v9M3 18h18M3 21h18",
  celebracion: "M12 3a5 5 0 0 1 5 5c0 3-3 5.5-5 7-2-1.5-5-4-5-7a5 5 0 0 1 5-5zM12 15c-1 2-1 4 1 6",
  oscuridad: "M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11z",
  pantalla: "M3 5h18v11H3zM8 21h8M12 16v5",
  sonido: "M4 10v4h4l5 4V6l-5 4H4zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12",
  silencio: "M4 4l16 16M9 17a3 3 0 0 0 6 0M18 13V9a6 6 0 0 0-9-5M6 10v3l-2 4h11",
  tiempo: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2"
};

export function Icono({ nombre, className }: { nombre: ExperienciaIcono; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={TRAZOS[nombre]} />
    </svg>
  );
}
