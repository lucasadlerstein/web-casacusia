import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Inter, Montserrat, Fuzzy_Bubbles } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "../globals.css";
import { locales, type Locale } from "@/lib/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationSchema } from "@/components/schema/OrganizationSchema";
import { CountryProvider } from "@/components/country/CountryProvider";
import { getCountry, hasCountryOverride } from "@/lib/country-server";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"]
});

const fuzzyBubbles = Fuzzy_Bubbles({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bubbles",
  weight: ["400", "700"]
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org"),
    title: { default: t("title"), template: "%s · CASACUSIA" },
    description: t("description"),
    keywords: ["hipoacusia", "sordera", "súbita", "pérdida auditiva", "sordo", "hipoacúsico", "casacusia", "implante coclear", "implante", "audífono", "hearing loss", "deaf", "cochlear implant"]
  };
}

export const viewport: Viewport = {
  themeColor: "#1DB97B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const tA11y = await getTranslations({ locale, namespace: "a11y" });
  const country = await getCountry();
  const isOverride = await hasCountryOverride();

  return (
    <html
      lang={locale as Locale}
      className={`${inter.variable} ${montserrat.variable} ${fuzzyBubbles.variable}`}
    >
      <body className="min-h-dvh flex flex-col">
        <a href="#main" className="skip-link">
          {tA11y("skipToContent")}
        </a>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CountryProvider initialCountry={country} initialOverride={isOverride}>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </CountryProvider>
        </NextIntlClientProvider>
        <OrganizationSchema />
        <Analytics />
        <SpeedInsights />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');${GADS_ID ? `gtag('config','${GADS_ID}');` : ''}`}
            </Script>
          </>
        )}
        {!GA_ID && GADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gads-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GADS_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
