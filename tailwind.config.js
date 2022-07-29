/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./pages/admin/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      gray: "#CBCBD4",
      theme: "#FFE202",
      black: "#000000",
      white: "#FFFFFF",
      lightTheme: "rgba(255, 226, 2, 0.5)",
      lightBlack: "rgba(0,0,0,0.5)",
      darkGray: "#898A8D",
      lightBlack: "#3A3A3A",
      lightGray: "#F5F5F5",
      green: "#34a853",
      lightGreen: "#51B960",
    },
    screens: {
      xlMax: { max: "1536px" },

      // => @media (max-width: 1279px) { ... }
      lgMax: { max: "1023px" },

      // => @media (max-width: 1023px) { ... }

      mdMax: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      smMax: { max: "639px" },
      // => @media (max-width: 639px) { ... }
      ...defaultTheme.screens,
    },
    extend: {
      width: {
        "3.5/12": "31.33%",
      },
    },
  },
  plugins: [],
};
