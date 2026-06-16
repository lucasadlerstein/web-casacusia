"use client";

import { useMemo, type ReactNode } from "react";
import Image from "next/image";
import { Heart, CalendarDays, Mail, Users, Handshake } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { trackEvent } from "@/lib/tracking";

/* ---------- types ---------- */

interface SidebarBlock {
  id: string;
  label: string;
  content: ReactNode;
}

interface ContentSidebarProps {
  /** Logos de aliados para el bloque de Aliados. */
  aliados?: { slug: string; nombre: string; logo: string }[];
}

/* ---------- helpers ---------- */

/** Fisher-Yates shuffle (deterministic per-render, random across visits). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function track(block: string, action: string = "click") {
  trackEvent("sidebar_click", { block, action });
}

/* ---------- individual blocks ---------- */

function BlockCasacusia() {
  return (
    <SidebarCard>
      <div className="flex items-center gap-2 mb-2">
        <Heart size={18} className="text-rosa-dark shrink-0" aria-hidden />
        <h3 className="font-display text-sm font-extrabold text-ink">Casacusia</h3>
      </div>
      <p className="text-xs text-ink-soft leading-relaxed">
        Fundación argentina que acompaña a personas con hipoacusia y sus familias
        para que nadie transite su pérdida auditiva en soledad.
      </p>
      <Link
        href="/nosotros"
        onClick={() => track("casacusia")}
        className="mt-3 inline-block text-xs font-bold text-verde-dark hover:underline underline-offset-2"
      >
        Conocenos
      </Link>
    </SidebarCard>
  );
}

function BlockEventos() {
  return (
    <SidebarCard>
      <div className="flex items-center gap-2 mb-2">
        <CalendarDays size={18} className="text-ambar shrink-0" aria-hidden />
        <h3 className="font-display text-sm font-extrabold text-ink">Encuentros</h3>
      </div>
      <p className="text-xs text-ink-soft leading-relaxed">
        Encuentros mensuales presenciales y virtuales, abiertos y gratuitos.
        Compartimos experiencias y nos acompañamos.
      </p>
      <Link
        href="/calendario"
        onClick={() => track("eventos")}
        className="mt-3 inline-block text-xs font-bold text-verde-dark hover:underline underline-offset-2"
      >
        Ver calendario
      </Link>
    </SidebarCard>
  );
}

function BlockNewsletter() {
  return (
    <SidebarCard>
      <div className="flex items-center gap-2 mb-2">
        <Mail size={18} className="text-violeta shrink-0" aria-hidden />
        <h3 className="font-display text-sm font-extrabold text-ink">Newsletter</h3>
      </div>
      <p className="text-xs text-ink-soft leading-relaxed">
        Recibí novedades de la fundación, nuevos episodios del podcast
        y recursos sobre hipoacusia.
      </p>
      <Link
        href="/#newsletter"
        onClick={() => track("newsletter")}
        className="mt-3 inline-block text-xs font-bold text-verde-dark hover:underline underline-offset-2"
      >
        Suscribirme
      </Link>
    </SidebarCard>
  );
}

function BlockSumate() {
  return (
    <SidebarCard>
      <div className="flex items-center gap-2 mb-2">
        <Users size={18} className="text-purpura shrink-0" aria-hidden />
        <h3 className="font-display text-sm font-extrabold text-ink">Sumate</h3>
      </div>
      <p className="text-xs text-ink-soft leading-relaxed">
        Podés ser voluntario/a, donar o acercar servicios profesionales.
        Toda ayuda multiplica el impacto.
      </p>
      <Link
        href="/sumate"
        onClick={() => track("sumate")}
        className="mt-3 inline-block text-xs font-bold text-verde-dark hover:underline underline-offset-2"
      >
        Quiero sumarme
      </Link>
    </SidebarCard>
  );
}

function BlockAliados({ aliados }: { aliados: { slug: string; nombre: string; logo: string }[] }) {
  if (aliados.length === 0) return null;
  return (
    <SidebarCard>
      <div className="flex items-center gap-2 mb-3">
        <Handshake size={18} className="text-verde-dark shrink-0" aria-hidden />
        <h3 className="font-display text-sm font-extrabold text-ink">Nos apoyan</h3>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {aliados.slice(0, 6).map((a) => (
          <div
            key={a.slug}
            className="relative h-8 w-16 grayscale"
            title={a.nombre}
          >
            <Image
              src={a.logo}
              alt={a.nombre}
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
        ))}
      </div>
      <Link
        href="/aliados"
        onClick={() => track("aliados", "ver_todos")}
        className="mt-3 inline-block text-xs font-bold text-verde-dark hover:underline underline-offset-2"
      >
        Conocé a nuestros aliados
      </Link>
    </SidebarCard>
  );
}

/* ---------- card wrapper ---------- */

function SidebarCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-surface-line bg-surface-card p-4 shadow-sm">
      {children}
    </div>
  );
}

/* ---------- main component ---------- */

export function ContentSidebar({ aliados = [] }: ContentSidebarProps) {
  const blocks: SidebarBlock[] = useMemo(() => {
    const all: SidebarBlock[] = [
      { id: "casacusia", label: "Casacusia", content: <BlockCasacusia /> },
      { id: "eventos", label: "Eventos", content: <BlockEventos /> },
      { id: "newsletter", label: "Newsletter", content: <BlockNewsletter /> },
      { id: "sumate", label: "Sumate", content: <BlockSumate /> },
    ];
    if (aliados.length > 0) {
      all.push({ id: "aliados", label: "Aliados", content: <BlockAliados aliados={aliados} /> });
    }
    return shuffle(all);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="flex flex-col gap-4" aria-label="Contenido relacionado">
      {blocks.map((b) => (
        <div key={b.id} data-sidebar-block={b.id}>
          {b.content}
        </div>
      ))}
    </aside>
  );
}
