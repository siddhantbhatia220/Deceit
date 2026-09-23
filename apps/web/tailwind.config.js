/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0D0D0D",
        card: "#151515",
        brand: {
          red: "#E50914",
          bright: "#FF1E2D",
          muted: "#8B0000",
          dark: "#2A0808",
        },
        text: {
          primary: "#FFFFFF",
          muted: "#B3B3B3",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
