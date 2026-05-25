"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { CountryIndicator } from "@/components/country/CountryIndicator";
import { cn } from "@/lib/utils/cn";

const primaryNav = [
  { href: "/nosotros",   key: "nosotros"   },
  { href: "/programas",  key: "programas"  },
  { href: "/podcast",    key: "podcast"    },
  { href: "/contacto",   key: "contacto"   }
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface-bg border-b border-surface-line shadow-sm">
      <div className="container flex h-16 items-center gap-4 md:h-[4.5rem]">

        {/* Logo real (PNG) */}
        <Link href="/" aria-label="CASACUSIA — inicio" className="flex shrink-0 items-center">
          <Logo variant="color" className="h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-0.5 ml-6">
          {primaryNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-tint hover:text-ink"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <CountryIndicator />
          <LangSwitcher className="hidden sm:inline-flex" />

          {/* Donar — siempre visible, color verde del brand */}
          <Link
            href="/sumate/donar"
            className={cn(
              "inline-flex h-9 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold",
              "bg-verde-dark text-white hover:bg-[#0a6b42] transition-colors",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-verde/30"
            )}
          >
            {tCommon("donar")}
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("cerrarMenu") : t("abrirMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-surface-tint transition-colors"
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="lg:hidden border-t border-surface-line bg-surface-bg shadow-md"
      >
        <nav aria-label="Menú mobile" className="container flex flex-col gap-1 py-4">
          {primaryNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-ink-soft hover:bg-surface-tint hover:text-ink transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-surface-line pt-4">
            <div className="flex items-center gap-2">
              <CountryIndicator compact />
              <LangSwitcher />
            </div>
            <Link
              href="/sumate/donar"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-full bg-verde-dark px-6 text-sm font-bold text-white hover:bg-[#0a6b42] transition-colors"
            >
              {tCommon("donar")}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
