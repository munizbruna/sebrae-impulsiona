/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sebrae: {
          blue: '#005CA9',
        }
      }
    },
  },
  plugins: [],
}