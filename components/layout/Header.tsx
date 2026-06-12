"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, ChevronDown } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { CountryIndicator } from "@/components/country/CountryIndicator";
import { cn } from "@/lib/utils/cn";

const primaryNav: readonly { href: string; key: string; dropdown?: boolean }[] = [
  { href: "/nosotros",    key: "nosotros"   },
  { href: "/programas",   key: "programas"  },
  { href: "/podcast",     key: "podcast", dropdown: true },
  { href: "/calendario",  key: "calendario" },
  { href: "/contacto",    key: "contacto"   }
];

const podcastSubnav = [
  { href: "/podcast",                label: "Todos los episodios" },
  { href: "/podcast?cat=historias",  label: "Historias de personas" },
  { href: "/podcast?cat=patologias", label: "Patologías" },
  { href: "/podcast?cat=tecnicos",   label: "Técnicos" },
  { href: "/podcast?cat=familiares", label: "Para familiares" }
];

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tHeader = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [podcastOpen, setPodcastOpen] = useState(false);
  const [mobilePodcastOpen, setMobilePodcastOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close desktop dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPodcastOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleMouseEnter() {
    clearTimeout(timeoutRef.current);
    setPodcastOpen(true);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setPodcastOpen(false), 200);
  }

  return (
    <header className="sticky top-0 z-40 bg-surface-bg border-b border-surface-line shadow-sm">
      <div className="container flex h-16 items-center gap-4 md:h-[4.5rem]">

        {/* Logo real (PNG) */}
        <Link href="/" aria-label="CASACUSIA — inicio" className="flex shrink-0 items-center">
          <Logo variant="color" className="h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav aria-label={tHeader("navPrincipal")} className="hidden lg:flex items-center gap-0.5 ml-6">
          {primaryNav.map((item) =>
            item.dropdown ? (
              <div
                key={item.key}
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setPodcastOpen((v) => !v)}
                  aria-expanded={podcastOpen}
                  aria-haspopup="true"
                  className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-tint hover:text-ink"
                >
                  {t(item.key)}
                  <ChevronDown size={14} aria-hidden className={cn("transition-transform", podcastOpen && "rotate-180")} />
                </button>
                {podcastOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-surface-line bg-surface-bg shadow-lg py-2 z-50">
                    {podcastSubnav.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setPodcastOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-surface-tint hover:text-ink transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-tint hover:text-ink"
              >
                {t(item.key)}
              </Link>
            )
          )}
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
        <nav aria-label={tHeader("menuMobile")} className="container flex flex-col gap-1 py-4">
          {primaryNav.map((item) =>
            item.dropdown ? (
              <div key={item.key}>
                <button
                  type="button"
                  onClick={() => setMobilePodcastOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-ink-soft hover:bg-surface-tint hover:text-ink transition-colors"
                >
                  {t(item.key)}
                  <ChevronDown size={16} aria-hidden className={cn("transition-transform", mobilePodcastOpen && "rotate-180")} />
                </button>
                {mobilePodcastOpen && (
                  <div className="ml-4 border-l-2 border-surface-line pl-3 pb-1">
                    {podcastSubnav.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => { setOpen(false); setMobilePodcastOpen(false); }}
                        className="block rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-surface-tint hover:text-ink transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-ink-soft hover:bg-surface-tint hover:text-ink transition-colors"
              >
                {t(item.key)}
              </Link>
            )
          )}
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
