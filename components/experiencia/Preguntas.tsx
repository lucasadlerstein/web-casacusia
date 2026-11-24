import type { ExperienciaContent } from "@/lib/content";

/** Preguntas frecuentes, compactas: viven junto al formulario de contacto. */
export function Preguntas({ preguntas }: { preguntas: ExperienciaContent["preguntas"] }) {
  return (
    <div className="mt-12 border-t border-exp-crema/10 pt-8">
      <h3 className="font-display text-xl font-extrabold text-exp-crema">{preguntas.titulo}</h3>
      <dl className="mt-4 max-w-3xl divide-y divide-exp-crema/10">
        {preguntas.items.map((it) => (
          <details key={it.pregunta} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <dt className="font-display font-bold text-exp-crema md:text-lg">{it.pregunta}</dt>
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amarillo text-amarillo transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <dd className="pb-5 pr-10 leading-relaxed text-exp-crema/75">{it.respuesta}</dd>
          </details>
        ))}
      </dl>
    </div>
  );
}
