import type { AlaParContent } from "@/lib/content";
import { Chevrons } from "./Deco";

export function ComoFunciona({ como }: { como: AlaParContent["comoFunciona"] }) {
  return (
    <section className="bg-alapar-crema">
      <div className="container py-20 md:py-28">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="font-onest text-3xl font-extrabold tracking-[-0.02em] text-alapar-cereza sm:text-4xl md:text-[3rem]">
            {como.titulo}
          </h2>
          <p className="text-lg text-ink-soft md:text-xl">{como.intro}</p>
        </div>

        <ol className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {como.pasos.map((paso, i) => (
            <li
              key={i}
              className="group relative flex flex-col rounded-3xl border border-alapar-cereza/10 bg-white p-7 transition-transform duration-200 ease-out hover:-translate-y-1"
            >
              <span className="font-onest text-5xl font-extrabold leading-none tracking-[-0.04em] text-alapar-azul">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-onest text-xl font-extrabold leading-tight text-ink">{paso.titulo}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">{paso.texto}</p>
              {i < como.pasos.length - 1 && (
                <Chevrons
                  count={1}
                  className="absolute -right-4 top-9 hidden w-5 text-alapar-naranja lg:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
