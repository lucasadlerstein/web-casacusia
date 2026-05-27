import { useTranslations } from "next-intl";
import { Instagram, Linkedin, Youtube, Facebook } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/nosotros", key: "nosotros" },
  { href: "/programas", key: "programas" },
  { href: "/podcast", key: "podcast" },
  { href: "/aliados", key: "aliados" },
  { href: "/impacto", key: "impacto" },
  { href: "/sumate", key: "sumate" },
  { href: "/recursos/faq", key: "recursos" },
  { href: "/contacto", key: "contacto" },
  { href: "/prensa", key: "prensa" }
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-surface-bg pt-16 pb-8 mt-24">
      <div className="container grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" aria-label="CASACUSIA" className="inline-flex text-surface-bg">
            <Logo className="h-7 w-auto" variant="white" />
          </Link>
          <p className="mt-5 text-sm md:text-base leading-relaxed max-w-sm text-surface-bg/80">{t("about")}</p>
        </div>

        <nav aria-label={t("nav")} className="text-sm">
          <h2 className="text-surface-bg/60 text-xs uppercase tracking-wider font-semibold mb-4">
            {t("nav")}
          </h2>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link href={link.href} className="hover:underline underline-offset-4">
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="text-surface-bg/60 text-xs uppercase tracking-wider font-semibold mb-4">
            {t("social")}
          </h2>
          <ul className="grid grid-cols-2 gap-2" aria-label={tA11y("social")}>
            <SocialItem href={site.social.instagram} label="Instagram" icon={<Instagram size={16} aria-hidden />} />
            <SocialItem href={site.social.linkedin} label="LinkedIn" icon={<Linkedin size={16} aria-hidden />} />
            <SocialItem href={site.whatsappCommunity} label="Comunidad" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            } />
            <SocialItem href={site.social.youtube} label="YouTube" icon={<Youtube size={16} aria-hidden />} />
            <SocialItem href={site.social.facebook} label="Facebook" icon={<Facebook size={16} aria-hidden />} />
          </ul>

          <h2 className="text-surface-bg/60 text-xs uppercase tracking-wider font-semibold mt-8 mb-4">
            {t("legal")}
          </h2>
          <ul className="space-y-1 text-surface-bg/80 text-xs">
            <li>{site.legalName}</li>
            <li>CUIT: {site.legal.cuit}</li>
            <li>{site.legal.arca}</li>
          </ul>
        </div>
      </div>

      <div className="container mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-surface-bg/70">
        <p>© {year} {site.legalName}. {t("rights")}</p>
        <div className="flex gap-4">
          <Link href="/contacto" className="hover:underline underline-offset-4">{t("privacidad")}</Link>
        </div>
      </div>
    </footer>
  );
}

function SocialItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 hover:underline underline-offset-4"
      >
        {icon}
        <span>{label}</span>
      </a>
    </li>
  );
}
