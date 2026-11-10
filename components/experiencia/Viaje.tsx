import type { ReactNode } from "react";
import type { ExperienciaAcento, ExperienciaContent } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import { Frase } from "./Frase";
import { OndasOido } from "./OndasOido";
import { ViajeFondo } from "./ViajeFondo";
import { ViajeSonido } from "./ViajeSonido";
import { Rotulo, botonClases, estiloAcento } from "./ui";

/**
 * El recorrido: el camino del sonido hacia adentro. Un fondo fijo (la espiral)
 * y, encima, un panel por estación que pasa con el scroll normal de la página.
 * Sin JS se lee igual: cada panel es contenido común.
 */

function Panel({
  id,
  acento,
  efecto,
  children,
  className
}: {
  id?: string;
  acento: ExperienciaAcento;
  /** Cómo se ve el fondo en este panel (ver ASPECTOS en ViajeFondo). */
  efecto: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      id={id}
      data-estacion=""
      data-acento={acento}
      data-efecto={efecto}
      style={estiloAcento(acento)}
      className={cn("flex min-h-[112svh] scroll-mt-16 items-center py-24", className)}
    >
      <div className="container">
        {/* Un velo oscuro detrás del texto para que el fondo nunca le gane a la lectura. */}
        <div data-lectura="" className="relative max-w-3xl">
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 -inset-y-10 -z-10 rounded-[3rem] bg-exp-noche/70 blur-2xl"
          />
          {children}
        </div>
      </div>
    </div>
  );
}

export function Viaje({ hero, viaje }: { hero: ExperienciaContent["hero"]; viaje: ExperienciaContent["viaje"] }) {
  const total = viaje.estaciones.length + 2;
  const numero = (n: number) => `${String(n).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section data-viaje="" className="group/viaje relative">
      <div className="pointer-events-none sticky top-0 h-[100svh] overflow-hidden" aria-hidden="true">
        <ViajeFondo />
      </div>

      <div className="relative -mt-[100svh]">
        <Panel id="inicio" acento="crema" efecto="clara" className="min-h-[100svh] pt-28">
          <Rotulo>{hero.etiqueta}</Rotulo>
          <h1 className="mt-6 font-display font-extrabold tracking-[-0.03em] text-exp-crema">
            <span className="block text-[2.9rem] leading-[0.98] sm:text-7xl md:text-[5.5rem]">{hero.titulo}</span>
            <span className="mt-5 block text-xl font-semibold leading-snug tracking-[-0.01em] text-exp-crema/85 sm:text-2xl md:text-[1.75rem]">
              {hero.subtitulo}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-exp-crema/75">{hero.bajada}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#sonido" className={botonClases("lleno")}>
              {hero.ctaRecorrido}
              <span aria-hidden="true">↓</span>
            </a>
            <a href="#sumate" className={botonClases("borde")}>
              {hero.ctaLlevar}
            </a>
          </div>
        </Panel>

        {viaje.estaciones.map((e, i) => (
          <Panel key={e.id} id={e.id} acento={e.acento} efecto={e.efecto}>
            <Rotulo>
              <span className="text-[color:var(--acento)]">{numero(i + 1)}</span>
              <span className="mx-2 text-exp-crema/30">·</span>
              {e.lugar}
            </Rotulo>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-exp-crema sm:text-5xl md:text-6xl">
              {e.titulo}
            </h2>
            <Frase
              frase={viaje.frase}
              efecto={e.efecto}
              etiqueta={viaje.fraseEtiqueta}
              descripcion={e.descripcionAccesible}
            />
            <p className="max-w-2xl text-lg leading-relaxed text-exp-crema/80 md:text-xl">{e.texto}</p>
            {e.animacion === "oido" && <OndasOido />}
          </Panel>
        ))}

        <Panel id="por-dentro" acento="crema" efecto="rumia">
          <Rotulo>
            <span className="text-exp-crema">{numero(total - 1)}</span>
            <span className="mx-2 text-exp-crema/30">·</span>
            {viaje.rumiacion.lugar}
          </Rotulo>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-exp-crema sm:text-5xl md:text-6xl">
            {viaje.rumiacion.titulo}
          </h2>
          <ul className="my-9 flex flex-col gap-3 md:my-11">
            {viaje.rumiacion.pensamientos.map((p, i) => (
              <li
                key={p}
                // Cada pensamiento un poco más adentro y más tenue: la voz que no para.
                style={{ marginLeft: `${(i % 3) * 1.25}rem`, opacity: 1 - i * 0.09 }}
                className="font-display text-2xl font-semibold italic leading-snug text-exp-crema sm:text-3xl"
              >
                {p}
              </li>
            ))}
          </ul>
          <p className="max-w-2xl text-lg leading-relaxed text-exp-crema/80 md:text-xl">{viaje.rumiacion.texto}</p>
        </Panel>

        <Panel id="oirlo" acento="rosa" efecto="latido">
          <Rotulo>
            <span className="text-[color:var(--acento)]">{numero(total)}</span>
            <span className="mx-2 text-exp-crema/30">·</span>
            {viaje.llegada.lugar}
          </Rotulo>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-exp-crema sm:text-5xl md:text-6xl">
            {viaje.llegada.titulo}
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-exp-crema/80 md:text-xl">{viaje.llegada.texto}</p>
          <a href="#sumate" className={botonClases("lleno", "mt-9")}>
            {hero.ctaLlevar}
          </a>
        </Panel>
      </div>

      <ViajeSonido sonido={viaje.sonido} />
    </section>
  );
}
