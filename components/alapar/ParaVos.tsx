import type { AlaParContent } from "@/lib/content";
import { AlaParButton } from "./AlaParButton";

function Check({ color }: { color: "naranja" | "rosa" }) {
  const cls = color === "naranja" ? "bg-alapar-naranja" : "bg-alapar-rosa";
  return (
    <span className={`mt-[0.35em] flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${cls} text-white`} aria-hidden="true">
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6.5 4.8 9 10 3.5" />
      </svg>
    </span>
  );
}

export function ParaVos({ paraVos }: { paraVos: AlaParContent["paraVos"] }) {
  return (
    <section className="bg-alapar-crema">
      <div className="container py-20 md:py-28">
        <h2 className="text-center font-onest text-3xl font-extrabold tracking-[-0.02em] text-alapar-cereza sm:text-[2.5rem] md:text-[3rem]">
          {paraVos.titulo}
        </h2>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          <article className="flex flex-col rounded-[2rem] bg-alapar-naranja-soft p-8 md:p-10">
            <h3 className="font-onest text-2xl font-extrabold text-alapar-cereza md:text-[1.875rem]">{paraVos.acompanado.titulo}</h3>
            <ul className="mt-6 space-y-3">
              <li className="flex gap-3 text-base font-bold leading-relaxed text-alapar-cereza md:text-lg">
                <Check color="naranja" />
                <span>{paraVos.acompanado.itemDestacado}</span>
              </li>
              {paraVos.acompanado.items.map((t) => (
                <li key={t} className="flex gap-3 text-base leading-relaxed text-ink md:text-lg">
                  <Check color="naranja" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <AlaParButton href="#sumate" variant="cereza" size="lg">{paraVos.acompanado.cta}</AlaParButton>
            </div>
          </article>

          <article className="flex flex-col rounded-[2rem] bg-alapar-rosa-soft p-8 md:p-10">
            <h3 className="font-onest text-2xl font-extrabold text-alapar-cereza md:text-[1.875rem]">{paraVos.par.titulo}</h3>
            <ul className="mt-6 space-y-3">
              {paraVos.par.items.map((t) => (
                <li key={t} className="flex gap-3 text-base leading-relaxed text-ink md:text-lg">
                  <Check color="rosa" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-alapar-cereza">{paraVos.par.recibisTitulo}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {paraVos.par.recibis.map((t) => (
                <li key={t} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-alapar-cereza">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <AlaParButton href={paraVos.par.href} variant="cereza" size="lg">{paraVos.par.cta}</AlaParButton>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
