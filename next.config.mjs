import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
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
      { source: "/podcast/:slug", destination: "/podcast", permanent: true },
      { source: "/colaborar", destination: "/sumate", permanent: true },
      { source: "/voluntarios", destination: "/sumate/voluntariado", permanent: true },
      { source: "/blog", destination: "/recursos/blog", permanent: true },
      { source: "/inicio/blog", destination: "/recursos/blog", permanent: true },
      { source: "/inicio/:path*", destination: "/:path*", permanent: true }
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

export default withNextIntl(nextConfig);
