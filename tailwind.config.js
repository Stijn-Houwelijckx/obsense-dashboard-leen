/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
          500: "#13E07E",
          600: "#08B160",
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
};
