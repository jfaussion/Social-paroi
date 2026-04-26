import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./domain/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: ({ theme }) => ({
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "feature-card-border": `linear-gradient(150deg, ${theme("colors.border-blue")}, ${theme("colors.border-orange")}0b, ${theme("colors.border-violet")}70)`,
        "landing-btn-gradient": `linear-gradient(120deg, ${theme("colors.light-blue")}, ${theme("colors.dark-blue")} 50%, ${theme("colors.dark-violet")} 92%, ${theme("colors.light-violet")} 100%)`,
      }),
      colors: {
        "aurora-violet": "#7c3aed",
        "aurora-blue": "#2563eb",
        "aurora-indigo": "#4338ca",
        "landing-bg": "#0a0a0f",
        "border-blue": "#0b56b1",
        "border-orange": "#f97416",
        "border-violet": "#6c02ee",
        "light-blue": "#4f7ff5",
        "dark-blue": "#2459e1",
        "dark-violet": "#7c3aed",
        "light-violet": "#ad47f1",
      },
    },
  },
  plugins: [],
};
export default config;
