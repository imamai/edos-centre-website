import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Edos Centre Brand Palette ──────────────────────────
        brand: {
          red:    "#E31E24",   // slightly softened from #FF0000 for UI legibility
          "red-vivid": "#FF0000",
          purple: "#2E234F",  // Technology Purple (primary dark)
          navy:   "#1A1733",  // Dark Navy (deepest bg)
          "accent-purple": "#6B5B95",
          muted:  "#F8F9FB",  // Light Background
        },
        // ── Semantic aliases ───────────────────────────────────
        background: "#F8F9FB",
        foreground:  "#1A1733",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem",  { lineHeight: "1.1", letterSpacing: "-0.04em" }],
        "display-xl":  ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display-lg":  ["3rem",    { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md":  ["2.25rem", { lineHeight: "1.2",  letterSpacing: "-0.02em" }],
        "display-sm":  ["1.875rem",{ lineHeight: "1.25", letterSpacing: "-0.01em" }],
      },
      backgroundImage: {
        "gradient-brand":     "linear-gradient(135deg, #1A1733 0%, #2E234F 50%, #1A1733 100%)",
        "gradient-red":       "linear-gradient(135deg, #E31E24 0%, #FF6B6B 100%)",
        "gradient-hero":      "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(227,30,36,0.18) 0%, transparent 60%), linear-gradient(180deg, #1A1733 0%, #0D0B1A 100%)",
        "gradient-card":      "linear-gradient(135deg, rgba(46,35,79,0.6) 0%, rgba(26,23,51,0.8) 100%)",
        "gradient-mesh":      "radial-gradient(at 40% 20%, rgba(107,91,149,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(227,30,36,0.15) 0px, transparent 40%), radial-gradient(at 0% 50%, rgba(46,35,79,0.4) 0px, transparent 50%)",
        "shimmer":            "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
      },
      boxShadow: {
        "glow-red":    "0 0 30px rgba(227, 30, 36, 0.35)",
        "glow-purple": "0 0 30px rgba(107, 91, 149, 0.3)",
        "card":        "0 4px 24px rgba(26, 23, 51, 0.12)",
        "card-hover":  "0 12px 48px rgba(26, 23, 51, 0.2)",
        "enterprise":  "0 20px 60px rgba(26, 23, 51, 0.25), 0 8px 24px rgba(227, 30, 36, 0.08)",
      },
      animation: {
        "flow-right":    "flowRight 3s linear infinite",
        "flow-down":     "flowDown 3s linear infinite",
        "pulse-glow":    "pulseGlow 2.5s ease-in-out infinite",
        "float":         "float 6s ease-in-out infinite",
        "shimmer":       "shimmer 2.5s linear infinite",
        "count-up":      "countUp 0.6s ease-out forwards",
        "slide-up":      "slideUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in":       "fadeIn 0.5s ease-out forwards",
        "spin-slow":     "spin 12s linear infinite",
        "draw-line":     "drawLine 1.5s ease-out forwards",
      },
      keyframes: {
        flowRight: {
          "0%":   { transform: "translateX(-100%)", opacity: "0" },
          "20%":  { opacity: "1" },
          "80%":  { opacity: "1" },
          "100%": { transform: "translateX(200%)", opacity: "0" },
        },
        flowDown: {
          "0%":   { transform: "translateY(-100%)", opacity: "0" },
          "20%":  { opacity: "1" },
          "80%":  { opacity: "1" },
          "100%": { transform: "translateY(200%)", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(227,30,36,0.3)" },
          "50%":      { boxShadow: "0 0 50px rgba(227,30,36,0.7)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideUp: {
          "0%":   { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        drawLine: {
          "0%":   { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
