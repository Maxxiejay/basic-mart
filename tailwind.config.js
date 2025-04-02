/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}", "./public/index.html"], 
  theme: {
    extend: {
      colors: {
        primary: "#115e59", // Custom color
        primaryDark: "#134e4a", // Custom color
        secondary: "#86efac", // Custom color
        secondaryDark: "#4ade80", // Custom color
        accent: "#fde047 ", // Custom color
      },
    },
  },
  plugins: [],
}

