import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        uploadHover: "0 0 0 4px rgba(59, 130, 246, 0.2)", // primary-500 kleur met 20% opacity
      },

      fontFamily: {
        title: ["Nohemi", "sans-serif"],
        text: ["Nunito", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#EFFEF6",
          100: "#D9FFEC",
          200: "#B5FDD9",
          300: "#7CF9BC",
          400: "#3CEC97",
          500: "#557EFE",
          600: "#1A50F4",
          700: "#0B8A4E",
          800: "#0E6D41",
          900: "#0E5938",
          950: "#01321D",
        },
        secondary: {
          600: "#404045",
          700: "#36363B",
          800: "#2B2B30",
          900: "#18181B",
        },
        neutral: {
          50: "#f6f6f5",
          100: "#e7e7e6",
          200: "#d1d1d0",
          300: "#b1b0af",
          400: "#8a8a86",
          500: "#6f6f6b",
          600: "#5e5d5c",
          700: "#504f4e",
          800: "#464644",
          900: "#3D3D3C",
          950: "#252524",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
