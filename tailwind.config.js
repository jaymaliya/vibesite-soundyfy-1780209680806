/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E8E0F0",
        secondary: "#2A1F3D",
        accent: "#00C9A7",
        surface: "#2A1F3D",
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Raleway", "sans-serif"],
      },
    },
  },
  plugins: [],
};
