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
          DEFAULT: "#F6F3EB",
          light: "#FCFAF6",
          alt: "#EDE6D8",
          dark: "#E3DBD0",
        },
        ink: {
          DEFAULT: "#191917",
          muted: "#6B6960",
          faint: "#9C988D",
        },
        terracotta: {
          DEFAULT: "#B75E3F",
          dark: "#964529",
        },
        forest: {
          DEFAULT: "#435A45",
          dark: "#2F4232",
        },
        gold: {
          DEFAULT: "#C39B57",
          dark: "#9E7B3A",
        },
        border: {
          DEFAULT: "#DFD9CC",
          dark: "#CFC7B8",
        },
      },
      fontFamily: {
        display: ["var(--font-archivo)", "Impact", "sans-serif"],
        serif: ["var(--font-instrument)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "Helvetica Neue", "sans-serif"],
      },
      letterSpacing: {
        tighter2: "-0.04em",
        tighter3: "-0.06em",
        widest2: "0.22em",
        widest3: "0.32em",
      },
    },
  },
  plugins: [],
};

export default config;
