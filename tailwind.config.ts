import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#111827",
          800: "#1f2937",
          600: "#4b5563",
          500: "#6b7280",
        },
        atlas: {
          mist: "#f7f6f2",
          cloud: "#fbfaf7",
          line: "#e7e2d8",
          sage: "#5f7565",
          tide: "#3f6f88",
          amber: "#a86f2c",
          rose: "#9f4f55",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 41, 55, 0.08)",
        card: "0 1px 2px rgba(31, 41, 55, 0.06), 0 14px 38px rgba(31, 41, 55, 0.06)",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
