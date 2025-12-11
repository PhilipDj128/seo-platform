import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      boxShadow: {
        glow: "0 10px 50px rgba(99, 102, 241, 0.35)",
      },
      backgroundImage: {
        "gradient-hero":
          "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.2), transparent 25%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.2), transparent 25%), linear-gradient(120deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.85) 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
