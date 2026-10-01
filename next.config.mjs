import createNextIntlPlugin from "next-intl/plugin";
import { withBotId } from "botid/next/config";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Cachea las imágenes optimizadas 30 días: menos re-optimización y menos
    // invocaciones de función en visitas repetidas (portadas del podcast, fotos).
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "casacusia.org" },
      { protocol: "https", hostname: "*.casacusia.org" },
      { protocol: "https", hostname: "d3t3ozftmdmh3i.cloudfront.net" }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  async redirects() {
    return [
      // ── QR de la lona 3×2 de la Expo ──────────────────────────────────
      // Estas dos URLs ya están impresas en la cartelería: el path es fijo y
      // el código se adapta a él, nunca al revés. Si cambia el link de
      // Mercado Pago se edita acá (o la variable de entorno) y se redeploya,
      // pero no se reimprime nada.
      // 302 a propósito: es un destino que puede cambiar, no queremos que
      // los navegadores ni Google lo cacheen como permanente.
      {
        source: "/sumate/donar/qr/mensual-libre",
        destination: process.env.LINK_MP_QR_MENSUAL_LIBRE ?? "https://mpago.la/2egULqJ",
        statusCode: 302
      },
      {
        source: "/sumate/donar/qr/unico-libre",
        destination:
          process.env.LINK_MP_QR_UNICO_LIBRE ?? "https://link.mercadopago.com.ar/casacusia",
        statusCode: 302
      },
      // Mismos QR con prefijo de idioma, por si alguien llega desde /en.
      {
        source: "/:locale(es|en)/sumate/donar/qr/mensual-libre",
        destination: process.env.LINK_MP_QR_MENSUAL_LIBRE ?? "https://mpago.la/2egULqJ",
        statusCode: 302
      },
      {
        source: "/:locale(es|en)/sumate/donar/qr/unico-libre",
        destination:
          process.env.LINK_MP_QR_UNICO_LIBRE ?? "https://link.mercadopago.com.ar/casacusia",
        statusCode: 302
      },

      { source: "/colaborar", destination: "/sumate", permanent: true },
      { source: "/voluntarios", destination: "/sumate/voluntariado", permanent: true },
      { source: "/blog", destination: "/recursos/blog", permanent: true },
      { source: "/inicio/blog", destination: "/recursos/blog", permanent: true },
      { source: "/inicio/:path*", destination: "/:path*", permanent: true },
      // Legacy WordPress: rutas viejas todavía indexadas por Google
      { source: "/calendar", destination: "/calendario", permanent: true },
      { source: "/author/:path*", destination: "/nosotros", permanent: true }
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" }
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  }
};

export default withBotId(withNextIntl(nextConfig));
