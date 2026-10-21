import Image from "next/image";
import type { AlaParContent } from "@/lib/content";
import { AlaParButton } from "./AlaParButton";

export function TopBar({ nav }: { nav: AlaParContent["nav"] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-alapar-cereza/10 bg-alapar-crema/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <a href="#inicio" className="flex items-center gap-3 rounded-lg" aria-label={nav.logoAlt}>
          <Image src="/alapar/pares.png" alt="" width={56} height={29} className="h-7 w-auto" priority />
          <span className="flex flex-col leading-none">
            <span className="font-onest text-[1.05rem] font-extrabold tracking-tight text-alapar-cereza">A LA PAR</span>
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">por Casacusia</span>
          </span>
        </a>
        <nav aria-label="Acciones" className="flex items-center gap-2">
          <AlaParButton href={nav.hrefPar} variant="outline" className="hidden whitespace-nowrap sm:inline-flex">
            {nav.ctaPar}
          </AlaParButton>
          <AlaParButton href="#sumate" variant="cereza" className="whitespace-nowrap px-4 text-sm sm:px-5 sm:text-[0.95rem]">
            {nav.ctaAcompanado}
          </AlaParButton>
        </nav>
      </div>
    </header>
  );
}
