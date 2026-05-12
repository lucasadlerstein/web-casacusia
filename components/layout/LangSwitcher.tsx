"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { locales, type Locale, localeLabels } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";
import { useTransition } from "react";

export function LangSwitcher({ className }: { className?: string }) {
  const t = useTranslations("a11y");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const otherLocale = locales.find((l) => l !== locale);
  if (!otherLocale) return null;

  return (
    <div className={cn("inline-flex items-center", className)} role="group" aria-label={t("languages")}>
      <button
        type="button"
        lang={otherLocale}
        aria-label={localeLabels[otherLocale]}
        onClick={() => {
          startTransition(() => {
            router.replace(pathname, { locale: otherLocale });
          });
        }}
        className="h-8 px-3 rounded-full text-sm font-medium text-ink-soft hover:text-ink hover:bg-surface-tint transition-colors"
      >
        {otherLocale.toUpperCase()}
      </button>
    </div>
  );
}
