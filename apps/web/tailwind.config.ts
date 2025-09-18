import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",
        card: "#111827",
        accent: "#00e0b8",
        accent2: "#7c3aed"
      },
      boxShadow: {
        glow: "0 0 30px rgba(0,224,184,0.25)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;
