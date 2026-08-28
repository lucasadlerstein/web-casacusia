import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "2rem", lg: "3rem" },
      screens: { "2xl": "1200px" }
    },
    extend: {
      colors: {
        /* ── Filamentos del isotipo ── */
        verde:    "var(--color-verde)",
        violeta:  "var(--color-violeta)",
        amarillo: "var(--color-amarillo)",
        rosa:     "var(--color-rosa)",
        naranja:  "var(--color-naranja)",
        magenta:  "var(--color-magenta)",
        lavanda:  "var(--color-lavanda)",

        /* ── Acento de campaña: Expo Hipoacusia 2026 ── */
        amatista:        "var(--color-amatista)",
        "amatista-soft": "var(--color-amatista-soft)",

        /* ── Variantes accesibles ── */
        "verde-dark":   "var(--color-verde-dark)",
        "violeta-dark": "var(--color-violeta-dark)",
        "rosa-dark":    "var(--color-rosa-dark)",

        /* ── Tints ── */
        "verde-soft":    "var(--color-verde-soft)",
        "violeta-soft":  "var(--color-violeta-soft)",
        "amarillo-soft": "var(--color-amarillo-soft)",
        "rosa-soft":     "var(--color-rosa-soft)",
        "naranja-soft":  "var(--color-naranja-soft)",

        /* ── Ink ── */
        ink: {
          DEFAULT: "var(--color-ink)",
          soft:    "var(--color-ink-soft)",
          muted:   "var(--color-ink-muted)"
        },

        /* ── Surfaces ── */
        surface: {
          DEFAULT: "var(--color-surface-bg)",
          bg:      "var(--color-surface-bg)",
          warm:    "var(--color-surface-warm)",
          card:    "var(--color-surface-card)",
          line:    "var(--color-surface-line)",
          tint:    "var(--color-surface-tint)"
        },

        /* ── Feedback ── */
        feedback: {
          ok:   "var(--color-ok)",
          warn: "var(--color-warn)",
          mid:  "var(--color-mid)"
        }
      },

      fontFamily: {
        sans:    ["var(--font-sans)",    "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        bubbles: ["var(--font-bubbles)", "cursive"]
      },

      fontSize: {
        display: [
          "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
          { lineHeight: "1.04", letterSpacing: "-0.025em" }
        ]
      },

      borderRadius: {
        sm:    "0.375rem",
        md:    "0.625rem",
        lg:    "0.875rem",
        xl:    "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.5rem"
      },

      boxShadow: {
        xs:    "0 1px 2px rgba(20,54,66,0.04)",
        sm:    "0 2px 4px rgba(20,54,66,0.06)",
        md:    "0 6px 14px rgba(20,54,66,0.08)",
        lg:    "0 16px 30px rgba(20,54,66,0.10)",
        xl:    "0 24px 48px rgba(20,54,66,0.14)",
        "card-hover": "0 8px 24px rgba(20,54,66,0.11)",
        focus:        "0 0 0 3px rgba(29,185,123,0.40)"
      },

      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        out:      "cubic-bezier(0, 0, 0.2, 1)"
      },

      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marquee 20s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
