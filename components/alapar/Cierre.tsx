import Image from "next/image";
import type { AlaParContent } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";
import { AlaParButton } from "./AlaParButton";
import { AcompanamientoButton } from "./AcompanamientoModal";

export function Cierre({ cierre, footer }: { cierre: AlaParContent["cierre"]; footer: AlaParContent["footer"] }) {
  return (
    <section className="relative overflow-hidden bg-alapar-cereza text-alapar-crema">
      <div className="container relative pb-10 pt-20 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <Image src="/alapar/pares.png" alt="" width={877} height={449} className="mx-auto h-auto w-40 md:w-56" />
          <p className="mt-8 font-onest text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[2.5rem] md:text-[3.5rem]">
            {cierre.frase}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <AcompanamientoButton variant="ambar" size="lg">{cierre.ctaAcompanado}</AcompanamientoButton>
            <AlaParButton href={cierre.hrefPar} variant="outlineLight" size="lg">{cierre.ctaPar}</AlaParButton>
          </div>
        </div>

        <footer className="mt-20 flex flex-col items-center gap-4 border-t border-alapar-crema/15 pt-8 text-sm text-alapar-crema/75 md:flex-row md:justify-between">
          <p>
            {footer.programaDe}{" "}
            <Link href={footer.hrefCasacusia} className="font-bold text-alapar-crema underline-offset-4 hover:underline">
              {footer.casacusia}
            </Link>
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <a href={`mailto:${footer.email}`} className="hover:text-alapar-crema hover:underline underline-offset-4">{footer.email}</a>
            <a href={footer.hrefInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-alapar-crema hover:underline underline-offset-4">
              {footer.instagram}
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
