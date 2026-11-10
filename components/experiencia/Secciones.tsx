import Image from "next/image";
import type { ExperienciaContent } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";
import { Bloque, Rotulo, botonClases, estiloAcento } from "./ui";

type C = ExperienciaContent;

export function TopBar({ nav, demo }: { nav: C["nav"]; demo: C["demo"] }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-exp-crema/10 bg-exp-noche/75 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-3">
        <a href="#inicio" aria-label={nav.logoAlt} className="flex items-center gap-2.5 rounded-lg">
          <Image src="/brand/logos/isotipo-color.png" alt="" width={464} height={433} className="h-7 w-auto" priority />
          <Image src="/brand/logos/letras-blanco.png" alt="" width={884} height={106} className="h-3 w-auto sm:h-3.5" priority />
        </a>
        <div className="flex items-center gap-3">
          <span
            title={demo.detalle}
            className="hidden rounded-full border border-amarillo/50 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-amarillo sm:inline"
          >
            {demo.aviso}
          </span>
          <a href="#sumate" className={botonClases("lleno", "min-h-[40px] whitespace-nowrap px-3.5 text-[0.8rem] sm:px-4 sm:text-sm")}>
            {nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}

export function Muestra({ muestra }: { muestra: C["muestra"] }) {
  return (
    <Bloque id="muestra" rotulo={muestra.etiqueta} titulo={muestra.titulo} intro={muestra.texto}>
      <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button type="button" disabled className={botonClases("borde", "cursor-not-allowed opacity-50 hover:translate-y-0")}>
          <span aria-hidden="true">▶</span>
          {muestra.boton}
        </button>
        <Rotulo>{muestra.nota}</Rotulo>
      </div>
    </Bloque>
  );
}

export function Voces({ voces }: { voces: C["voces"] }) {
  return (
    <Bloque id="voces" titulo={voces.titulo} intro={voces.intro}>
      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-10">
        {voces.grupos.map((g) => (
          <div key={g.titulo} style={estiloAcento(g.acento)}>
            <h3 className="font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-[color:var(--acento)]">
              {g.titulo}
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {g.citas.map((c) => (
                <li key={c.cita} className="rounded-2xl border border-exp-crema/10 bg-exp-panel p-6 md:p-7">
                  <blockquote className="font-display text-xl font-semibold leading-snug text-exp-crema md:text-[1.4rem]">
                    «{c.cita}»
                  </blockquote>
                  <p className="mt-4 text-sm text-exp-crema/60">{c.quien}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Bloque>
  );
}

export function Formato({ formato }: { formato: C["formato"] }) {
  return (
    <Bloque id="formato" titulo={formato.titulo} intro={formato.intro}>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-exp-crema/10 bg-exp-crema/10 sm:grid-cols-2 lg:grid-cols-4">
        {formato.pasos.map((p, i) => (
          <li key={p.titulo} className="bg-exp-noche p-6 md:p-7">
            <Rotulo className="text-amarillo">
              {String(i + 1).padStart(2, "0")} · {p.tiempo}
            </Rotulo>
            <h3 className="mt-4 font-display text-2xl font-extrabold text-exp-crema">{p.titulo}</h3>
            <p className="mt-3 leading-relaxed text-exp-crema/75">{p.texto}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-3xl border-l-2 border-verde pl-5 text-lg leading-relaxed text-exp-crema/85">
        {formato.paraQuien}
      </p>
    </Bloque>
  );
}

export function Espacios({ espacios }: { espacios: C["espacios"] }) {
  return (
    <Bloque id="espacios" titulo={espacios.titulo} intro={espacios.intro}>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {espacios.items.map((it) => (
          <li key={it.titulo} className="rounded-2xl border border-exp-crema/10 bg-exp-panel p-6 md:p-7">
            <h3 className="font-display text-xl font-extrabold text-exp-crema">{it.titulo}</h3>
            <p className="mt-2 leading-relaxed text-exp-crema/75">{it.texto}</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-14 font-mono text-xs uppercase tracking-[0.2em] text-exp-crema/60">{espacios.fechasTitulo}</h3>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {espacios.fechas.map((f) => (
          <li key={f.mes} className="border-t border-amarillo/60 pt-4">
            <p className="font-display text-3xl font-extrabold text-exp-crema">{f.mes}</p>
            <p className="mt-1 text-exp-crema/70">{f.motivo}</p>
          </li>
        ))}
      </ul>

      <p className="mt-12 max-w-3xl text-lg leading-relaxed text-exp-crema/85">{espacios.beneficio}</p>
    </Bloque>
  );
}

export function Sala({ sala }: { sala: C["sala"] }) {
  return (
    <Bloque id="sala" titulo={sala.titulo} intro={sala.intro}>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <ul className="flex flex-col">
          {sala.requisitos.map((r) => (
            <li key={r.titulo} className="flex gap-4 border-t border-exp-crema/10 py-5 first:border-t-0 first:pt-0">
              <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-verde" />
              <p className="leading-relaxed text-exp-crema/75">
                <strong className="font-bold text-exp-crema">{r.titulo}.</strong> {r.texto}
              </p>
            </li>
          ))}
        </ul>
        <aside className="self-start rounded-2xl border border-amarillo/40 bg-exp-panel p-6 md:p-8">
          <h3 className="font-display text-xl font-extrabold text-amarillo">{sala.sinSonidoTitulo}</h3>
          <p className="mt-3 leading-relaxed text-exp-crema/85">{sala.sinSonidoTexto}</p>
          <a href="#sumate" className={botonClases("borde", "mt-6")}>
            {sala.sinSonidoCta}
          </a>
        </aside>
      </div>
    </Bloque>
  );
}

export function Cierre({ cierre }: { cierre: C["cierre"] }) {
  return (
    <section className="border-t border-exp-crema/10 pb-10 pt-24 md:pt-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-exp-crema sm:text-5xl md:text-6xl">
            {cierre.frase}
          </p>
          <a href="#sumate" className={botonClases("lleno", "mt-10")}>
            {cierre.cta}
          </a>
        </div>
        <footer className="mt-24 flex flex-col items-center gap-3 border-t border-exp-crema/10 pt-8 text-center text-sm text-exp-crema/65 md:flex-row md:justify-between md:text-left">
          <p>{cierre.creditos}</p>
          <p>
            {cierre.programaDe}{" "}
            <Link href={cierre.hrefCasacusia} className="font-bold text-exp-crema underline-offset-4 hover:underline">
              {cierre.casacusia}
            </Link>
          </p>
        </footer>
      </div>
    </section>
  );
}
