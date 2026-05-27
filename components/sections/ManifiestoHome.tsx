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
        <h2
          id="home-manifiesto-title"
          className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-ink"
        >
          {t("titlePre")}{" "}
          <span className="text-rosa">{t("titleColored")}</span>{" "}
          {t("titlePost")}
        </h2>

        <p className="mt-8 text-lg md:text-xl leading-relaxed text-ink-soft font-medium">
          {t("lead")}
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
