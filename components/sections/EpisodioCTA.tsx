import { Headphones, Play } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";

/** CTA de cierre al episodio madre del podcast desde una nota del blog. */
export function EpisodioCTA({
  slug,
  titulo,
  numero
}: {
  slug: string;
  titulo: string;
  numero?: number;
}) {
  const label = numero ? `Episodio ${numero}` : "Episodio";

  return (
    <div className="mt-12 rounded-3xl bg-ink text-white p-8 md:p-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-wider font-bold">
        <Headphones size={14} aria-hidden /> Sordo pero no mudo · {label}
      </div>
      <p className="mt-4 font-display text-xl md:text-2xl font-extrabold leading-snug">
        Esta nota nace de una conversación real. Escuchala completa:
      </p>
      <p className="mt-2 text-white/80">{titulo}</p>
      <Link
        href={`/podcast/${slug}`}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-amarillo px-6 py-3 text-sm font-bold text-ink transition-transform hover:scale-105"
      >
        <Play size={16} aria-hidden /> Ver el episodio completo
      </Link>
    </div>
  );
}
