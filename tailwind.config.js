/** @type {import('tailwindcss').Config} */
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
    },
    extend: {},
  },
  plugins: [],
};
