import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Filamento } from "@/components/ui/Filamento";

export function ManifiestoHome() {
  const t = useTranslations("nosotros.manifiesto");
  const tHome = useTranslations("home.manifiesto");

  return (
    <Section
      background="default"
      ariaLabelledBy="home-manifiesto-title"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <Filamento name="verde" className="-top-12 right-0 w-56 rotate-[12deg]" opacity={12} />
      <Filamento name="rosa" className="-bottom-16 -left-8 w-72 rotate-[-18deg]" opacity={10} />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-display text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-verde-dark mb-4">
          {t("eyebrow")}
        </p>

        <h2
          id="home-manifiesto-title"
          className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-ink"
        >
          {t("title")}
        </h2>

        <p className="mt-8 text-lg md:text-xl leading-relaxed text-ink-soft font-medium">
          {t("lead")}
        </p>

        <p className="mt-6 font-display text-2xl md:text-3xl font-bold leading-snug text-ink">
          {t("kicker")}
        </p>

        <div className="mt-10">
          <Button href="/nosotros#manifiesto-title" variant="secondary" size="lg">
            {tHome("cta")}
          </Button>
        </div>
      </div>
    </Section>
  );
}
