import type { ReactNode } from "react";
import { Onest } from "next/font/google";

/**
 * Layout autónomo de la landing A la Par: sin Header ni Footer de Casacusia.
 * Tipografía del manual del programa: Onest ExtraBold (títulos) + Montserrat (cuerpo).
 */
const onest = Onest({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-onest",
  weight: ["700", "800"]
});

export default function AlaParLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className={`${onest.variable} flex-1 bg-alapar-crema font-display text-ink`}>
      {children}
    </main>
  );
}
