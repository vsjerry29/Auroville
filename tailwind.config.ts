import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F0EADF",
          light: "#F8F4EB",
          dark: "#E6DFD2",
        },
        ink: {
          DEFAULT: "#1B1D19",
          muted: "#79766C",
          faint: "#A5A196",
        },
        terracotta: {
          DEFAULT: "#B65F42",
          dark: "#964A31",
        },
        forest: {
          DEFAULT: "#3D5642",
          dark: "#2D4031",
        },
        gold: {
          DEFAULT: "#C59A46",
          dark: "#A37E33",
        },
        border: {
          DEFAULT: "#D7D0C3",
          light: "#EAE4D9",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "Helvetica Neue", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
        widest3: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
