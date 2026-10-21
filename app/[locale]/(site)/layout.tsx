import type { ReactNode } from "react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExpoHipoacusiaModal } from "@/components/sections/ExpoHipoacusiaModal";
import { ExpoHipoacusiaBanner } from "@/components/sections/ExpoHipoacusiaBanner";

/**
 * Cromo del sitio institucional: banner, Header, Footer y modal de campaña.
 * Las landings autónomas (`(landing)/*`) no pasan por acá.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ExpoHipoacusiaBanner />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <ExpoHipoacusiaModal />
    </>
  );
}
