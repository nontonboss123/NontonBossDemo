
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#e50914",
          black: "#141414"
        }
      }
    }
  },
  plugins: [],
}
