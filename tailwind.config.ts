import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#F8F6FE',
          100: '#EBE5FD',
          200: '#D7CBFC',
          300: '#C3B1FA',
          400: '#AF97F8',
          500: '#7866CC',
          600: '#5E50A0',
          700: '#362B6B',
          800: '#191046',
          900: '#1B0A38',
        },
      },
    },
  },
  plugins: [],
};
export default config;
