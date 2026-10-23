import type { ReactNode } from "react";
import Image from "next/image";
import type { AlaParContent } from "@/lib/content";
import { Chevrons } from "./Deco";

/** Reemplaza {solo} y {par} del título por los dos conceptos, cada uno con su color. */
function renderTitulo(titulo: string, solo: string, par: string): ReactNode[] {
  return titulo.split(/(\{solo\}|\{par\})/).map((parte, i) => {
    if (parte === "{solo}") {
      return (
        <span key={i} className="whitespace-nowrap text-ink-muted line-through decoration-alapar-naranja/60 decoration-[0.08em]">
          {solo}
        </span>
      );
    }
    if (parte === "{par}") {
      return (
        <span key={i} className="whitespace-nowrap bg-gradient-to-r from-alapar-naranja to-alapar-rosa bg-clip-text text-transparent">
          {par}
        </span>
      );
    }
    return parte;
  });
}

/** Una figura sola, en gris. */
function FiguraSola() {
  return (
    <span className="relative block h-8 w-8 shrink-0" aria-hidden="true">
      <Image src="/alapar/figura-naranja.png" alt="" width={440} height={449} className="h-full w-full object-contain opacity-60 grayscale" />
    </span>
  );
}

/** Las dos figuras; la rosa termina de acercarse cuando la fila recibe hover. */
function FiguraDupla() {
  return (
    <span className="relative block h-8 w-16 shrink-0" aria-hidden="true">
      <Image
        src="/alapar/figura-naranja.png"
        alt=""
        width={440}
        height={449}
        className="absolute left-0 top-0 h-full w-1/2 object-contain transition-transform duration-500 ease-out group-hover:-translate-x-0.5"
      />
      <Image
        src="/alapar/figura-rosa.png"
        alt=""
        width={441}
        height={449}
        className="absolute right-0 top-0 h-full w-1/2 object-contain opacity-80 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100 translate-x-1"
      />
    </span>
  );
}

export function Contraste({ contraste, apoyo }: { contraste: AlaParContent["contraste"]; apoyo: AlaParContent["apoyo"] }) {
  return (
    <section className="bg-alapar-crema">
      <div className="container py-20 md:py-28">
        <h2 className="mx-auto max-w-3xl text-center font-onest text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-alapar-cereza sm:text-[2.5rem] md:text-[3rem]">
          {renderTitulo(contraste.titulo, contraste.labelSolo, contraste.labelPar)}
        </h2>

        <div className="mx-auto mt-12 max-w-5xl md:mt-16">
          {/* Cabecera de columnas (desktop) */}
          <div className="hidden grid-cols-[1fr_3rem_1fr] gap-4 px-6 pb-3 text-xs font-bold uppercase tracking-[0.16em] md:grid">
            <span className="text-ink-muted">{contraste.labelSolo}</span>
            <span />
            <span className="text-alapar-cereza">{contraste.labelPar}</span>
          </div>

          <ol className="space-y-3">
            {contraste.items.map((item, i) => (
              <li
                key={i}
                className="group grid gap-3 overflow-hidden rounded-3xl border border-alapar-cereza/10 bg-white/70 transition-[box-shadow,border-color] duration-300 hover:border-alapar-ambar/60 hover:shadow-[0_24px_50px_-30px_rgba(234,89,33,0.45)] md:grid-cols-[1fr_3rem_1fr] md:gap-4"
              >
                {/* En soledad */}
                <div className="flex items-start gap-3 px-6 pt-6 transition-opacity duration-300 group-hover:opacity-60 md:py-6">
                  <FiguraSola />
                  <p className="text-base leading-relaxed text-ink-muted md:text-lg">
                    <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.16em] md:hidden">{contraste.labelSolo}</span>
                    {item.solo}
                  </p>
                </div>

                {/* Flecha (desktop) */}
                <div className="hidden items-center justify-center md:flex">
                  <Chevrons count={1} className="w-4 text-alapar-naranja transition-transform duration-300 group-hover:translate-x-1" />
                </div>

                {/* A la Par */}
                <div className="relative flex items-start gap-3 px-6 pb-6 md:py-6">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-alapar-ambar-soft/0 via-alapar-ambar-soft/70 to-alapar-rosa-soft/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div className="relative flex items-start gap-3">
                    <FiguraDupla />
                    <p className="text-base font-semibold leading-relaxed text-alapar-cereza md:text-lg">
                      <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.16em] md:hidden">{contraste.labelPar}</span>
                      {item.par}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Quien financia el piloto: solo el logo */}
      <div className="container pb-16 md:pb-24">
        <Image src={apoyo.logo} alt={apoyo.logoAlt} width={784} height={800} className="mx-auto h-36 w-auto md:h-44" />
      </div>

      {/* La frase fuerte del programa: banda propia, a todo el ancho */}
      <div className="container pb-20 md:pb-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-white px-6 py-16 text-center shadow-[0_30px_80px_-50px_rgba(145,27,71,0.45)] md:px-12 md:py-24">
          <Image src="/alapar/pares.png" alt="" width={877} height={449} className="mx-auto mb-8 h-auto w-28 md:w-36" />
          <p className="font-onest text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[2.25rem] md:text-[3.6rem] lg:text-[4.2rem]">
            <span className="block text-ink-soft">{contraste.cierreLinea1}</span>
            <span className="block text-alapar-cereza">{contraste.cierreLinea2}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
