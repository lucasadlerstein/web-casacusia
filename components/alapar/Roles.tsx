import type { AlaParContent } from "@/lib/content";
import { Estallido } from "./Deco";

export function Roles({ roles }: { roles: AlaParContent["roles"] }) {
  return (
    <section className="relative overflow-hidden bg-alapar-azul text-alapar-crema">
      <Estallido className="absolute -right-20 -top-20 z-0 w-48 text-alapar-ambar/70 md:w-72" />
      <div className="container relative py-20 md:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-alapar-ambar">{roles.titulo}</p>
        <blockquote className="mt-4 max-w-4xl font-onest text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-4xl md:text-[3.1rem]">
          {roles.frase}
        </blockquote>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          <div className="rounded-3xl bg-alapar-crema p-7 text-ink md:p-9">
            <h3 className="font-onest text-2xl font-extrabold text-alapar-cereza">{roles.esTitulo}</h3>
            <ul className="mt-5 space-y-3">
              {roles.es.map((t) => (
                <li key={t} className="flex gap-3 text-base leading-relaxed md:text-lg">
                  <span className="mt-[0.6em] h-2.5 w-2.5 shrink-0 rounded-full bg-alapar-naranja" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border-2 border-alapar-crema/25 p-7 md:p-9">
            <h3 className="font-onest text-2xl font-extrabold text-alapar-ambar">{roles.noEsTitulo}</h3>
            <ul className="mt-5 space-y-3">
              {roles.noEs.map((t) => (
                <li key={t} className="flex gap-3 text-base leading-relaxed text-alapar-crema/90 md:text-lg">
                  <span className="mt-[0.7em] h-0.5 w-3 shrink-0 rounded-full bg-alapar-ambar" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 max-w-3xl">
          <h3 className="font-onest text-xl font-extrabold text-alapar-ambar">{roles.acompanado.titulo}</h3>
          <p className="mt-2 text-lg leading-relaxed text-alapar-crema/90">{roles.acompanado.texto}</p>
        </div>
      </div>
    </section>
  );
}
