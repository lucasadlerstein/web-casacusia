import Image from "next/image";
import type { ExperienciaContent } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { DejarVoz } from "./DejarVoz";
import { Bloque, Rotulo, botonClases, t } from "./ui";

type C = ExperienciaContent;

const linkNav =
  "whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-exp-crema/75 transition-colors duration-200 hover:bg-exp-crema/10 hover:text-exp-crema " +
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-amarillo";

export function TopBar({ nav }: { nav: C["nav"] }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-exp-crema/10 bg-exp-noche/80 text-exp-crema backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-3">
        <a href="#inicio" aria-label={nav.logoAlt} className="flex items-center gap-2.5 rounded-lg">
          <Image src="/brand/logos/isotipo-color.png" alt="" width={464} height={433} className="h-7 w-auto" priority />
          <Image src="/brand/logos/letras-blanco.png" alt="" width={884} height={106} className="h-3 w-auto sm:h-3.5" priority />
        </a>
        <nav aria-label={nav.seccionesLabel} className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkNav}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#sumate"
          className="inline-flex min-h-[40px] items-center justify-center whitespace-nowrap rounded-full bg-exp-crema px-3.5 font-display text-[0.8rem] font-bold text-exp-noche transition-colors duration-200 hover:bg-amarillo focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-amarillo sm:px-4 sm:text-sm"
        >
          {nav.cta}
        </a>
      </div>
      {/* En celular las secciones van en una segunda fila que se desliza. */}
      <nav aria-label={nav.seccionesLabel} className="border-t border-exp-crema/10 md:hidden">
        <ul className="container flex gap-1 overflow-x-auto py-1.5 text-[0.8rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nav.links.map((l) => (
            <li key={l.href} className="shrink-0">
              <a href={l.href} className={linkNav}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Muestra({ muestra }: { muestra: C["muestra"] }) {
  return (
    <Bloque id="muestra" tono="panel" rotulo={muestra.etiqueta} titulo={muestra.titulo} intro={muestra.texto}>
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

/** Papel de cada post-it y una inclinación distinta para que parezcan pegados a mano. */
const PAPEL: Record<C["voces"]["citas"][number]["papel"], string> = {
  amarillo: "bg-exp-papel-amarillo",
  rosa: "bg-exp-papel-rosa",
  verde: "bg-exp-papel-verde",
  amatista: "bg-exp-papel-amatista"
};
const INCLINACION = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-[1.5deg]", "rotate-[0.5deg]"] as const;

export function Voces({ voces }: { voces: C["voces"] }) {
  return (
    <Bloque id="voces" tono="luz" titulo={voces.titulo} intro={voces.intro}>
      <ul className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">
        {voces.citas.map((c, i) => (
          <li
            key={c.cita}
            className={cn(
              "relative rounded-sm p-6 pt-8 shadow-[0_14px_30px_-14px_rgb(20_54_66/0.45)] transition-transform duration-300 ease-out motion-safe:hover:rotate-0 motion-safe:hover:scale-[1.02]",
              PAPEL[c.papel],
              INCLINACION[i % INCLINACION.length]
            )}
          >
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] bg-white/55 shadow-sm"
            />
            <blockquote className="font-bubbles text-[1.2rem] leading-snug text-ink">{c.cita}</blockquote>
            <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft">{c.quien}</p>
          </li>
        ))}
        <li className={cn("relative", INCLINACION[voces.citas.length % INCLINACION.length])}>
          <DejarVoz dejar={voces.dejar} />
        </li>
      </ul>
    </Bloque>
  );
}

export function Formato({ formato }: { formato: C["formato"] }) {
  return (
    <Bloque id="formato" titulo={formato.titulo} intro={formato.intro}>
      <ol className={cn("mt-12 grid gap-px overflow-hidden rounded-2xl border bg-[color:var(--linea)] sm:grid-cols-2 lg:grid-cols-4", t.linea)}>
        {formato.pasos.map((p, i) => (
          <li key={p.titulo} className={cn("p-6 md:p-7", t.fondo)}>
            <Rotulo className="text-amarillo">
              {String(i + 1).padStart(2, "0")} · {p.tiempo}
            </Rotulo>
            <h3 className={cn("mt-4 font-display text-2xl font-extrabold", t.tinta)}>{p.titulo}</h3>
            <p className={cn("mt-3 leading-relaxed", t.suave)}>{p.texto}</p>
          </li>
        ))}
      </ol>
      <p className={cn("mt-8 max-w-3xl border-l-2 border-verde pl-5 text-lg leading-relaxed", t.suave)}>
        {formato.paraQuien}
      </p>
    </Bloque>
  );
}

export function Espacios({ espacios }: { espacios: C["espacios"] }) {
  return (
    <Bloque id="espacios" tono="luz" titulo={espacios.titulo} intro={espacios.intro}>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {espacios.items.map((it) => (
          <li key={it.titulo} className={cn("rounded-2xl border p-6 md:p-7", t.linea, t.sup)}>
            <h3 className={cn("font-display text-xl font-extrabold", t.tinta)}>{it.titulo}</h3>
            <p className={cn("mt-2 leading-relaxed", t.suave)}>{it.texto}</p>
          </li>
        ))}
      </ul>

      <h3 className={cn("mt-14 font-mono text-xs uppercase tracking-[0.2em]", t.tenue)}>{espacios.fechasTitulo}</h3>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {espacios.fechas.map((f) => (
          <li key={f.mes} className="border-t border-amarillo/60 pt-4">
            <p className={cn("font-display text-3xl font-extrabold", t.tinta)}>{f.mes}</p>
            <p className={cn("mt-1", t.suave)}>{f.motivo}</p>
          </li>
        ))}
      </ul>

      <p className={cn("mt-12 max-w-3xl text-lg leading-relaxed", t.suave)}>{espacios.beneficio}</p>
    </Bloque>
  );
}

export function Sala({ sala }: { sala: C["sala"] }) {
  return (
    <Bloque id="sala" tono="panel" titulo={sala.titulo} intro={sala.intro}>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <ul className="flex flex-col">
          {sala.requisitos.map((r) => (
            <li key={r.titulo} className={cn("flex gap-4 border-t py-5 first:border-t-0 first:pt-0", t.linea)}>
              <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-verde" />
              <p className={cn("leading-relaxed", t.suave)}>
                <strong className={cn("font-bold", t.tinta)}>{r.titulo}.</strong> {r.texto}
              </p>
            </li>
          ))}
        </ul>
        <aside className={cn("self-start rounded-2xl border border-amarillo/40 p-6 md:p-8", t.sup)}>
          <h3 className="font-display text-xl font-extrabold text-amarillo">{sala.sinSonidoTitulo}</h3>
          <p className={cn("mt-3 leading-relaxed", t.suave)}>{sala.sinSonidoTexto}</p>
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
