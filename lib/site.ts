export const site = {
  name: "CASACUSIA",
  legalName: "Fundación CASACUSIA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org",
  tagline: "Transitando juntos la hipoacusia",
  foundingDate: "2025-01",
  email: "somos@casacusia.org",
  whatsappCommunity: "https://chat.whatsapp.com/IUlYFEaFWiBHaFmzwvqL4D",
  donationUrl: "/sumate/donar",
  social: {
    instagram: "https://www.instagram.com/casacusia.ong/",
    tiktok: "https://www.tiktok.com/@casacusia",
    linkedin: "https://www.linkedin.com/company/casacusia",
    youtube: "https://www.youtube.com/@Hipoacusico",
    facebook: "https://www.facebook.com/people/Casacusia/61573395301782/",
    spotify: "https://open.spotify.com/",
    applePodcasts: "https://podcasts.apple.com/"
  },
  legal: {
    cuit: "30-71890622-7",
    personeria: "Personería jurídica aprobada",
    arca: "Aprobación ARCA para deducción de Impuesto a las Ganancias",
    address: "Ciudad Autónoma de Buenos Aires, Argentina"
  },
  recognitions: [
    { label: "ARCA · Deducción de Ganancias", description: "Empresas donantes pueden deducir del Impuesto a las Ganancias." },
    { label: "Interés social · Misiones" },
    { label: "Interés social · Posadas" },
    { label: "Interés social · Mendoza" }
  ]
} as const;
