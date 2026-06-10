import { useTranslations } from "next-intl";
import { ArrowUpRight, Ear, Heart, Handshake } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { Section } from "@/components/ui/Section";

type Card = {
  titleKey: "cardA" | "cardB" | "cardC";
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  borderHover: string;
  ctaColor: string;
  accentDot: string;
};

const cards: Card[] = [
  {
    titleKey: "cardA",
    href: "/programas/encuentros",
    icon: <Ear size={22} aria-hidden />,
    iconBg:      "bg-verde-soft",
    iconColor:   "text-verde-dark",
    borderHover: "hover:border-verde",
    ctaColor:    "text-verde-dark",
    accentDot:   "bg-verde"
  },
  {
    titleKey: "cardB",
    href: "/programas/red-padres-madres",
    icon: <Heart size={22} aria-hidden />,
    iconBg:      "bg-violeta-soft",
    iconColor:   "text-violeta-dark",
    borderHover: "hover:border-violeta",
    ctaColor:    "text-violeta-dark",
    accentDot:   "bg-violeta"
  },
  {
    titleKey: "cardC",
    href: "/sumate/proyectos-juntos",
    icon: <Handshake size={22} aria-hidden />,
    iconBg:      "bg-rosa-soft",
    iconColor:   "text-rosa-dark",
    borderHover: "hover:border-rosa",
    ctaColor:    "text-rosa-dark",
    accentDot:   "bg-rosa"
  }
];

export function PathCards() {
  const t = useTranslations("home.paths");

  return (
    <Section background="default" ariaLabelledBy="home-paths" className="py-20 md:py-28">
      <div className="text-center mb-16">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-rosa mb-4">
          {t("eyebrow")}
        </p>
        <h2 id="home-paths" className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
          {t("title")}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.titleKey}
            href={card.href}
            className={[
              "group flex flex-col rounded-3xl bg-white border border-surface-line p-8 md:p-10",
              "hover:shadow-2xl hover:shadow-ink/5 transition-all duration-500 hover:-translate-y-2",
              card.borderHover
            ].join(" ")}
          >
            {/* Icon Wrapper */}
            <div className="relative mb-8">
              <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {card.icon}
              </span>
              <div className={`absolute -inset-2 ${card.iconBg} opacity-20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500`} />
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-ink group-hover:text-ink transition-colors">
              {t(`${card.titleKey}.title` as const)}
            </h3>
            <p className="mt-4 flex-1 leading-relaxed text-ink-soft text-lg">
              {t(`${card.titleKey}.body` as const)}
            </p>

            {/* CTA row */}
            <div className="mt-10 pt-8 border-t border-surface-line/50">
              <p className={[
                "inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all",
                card.ctaColor
              ].join(" ")}>
                {t(`${card.titleKey}.cta` as const)}
                <ArrowUpRight
                  size={18}
                  aria-hidden
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
