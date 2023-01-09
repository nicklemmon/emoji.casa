/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      primary: ['PT Sans', 'sans-serif'],
      secondary: ['Nunito', 'sans-serif'],
    },
  },
  plugins: [],
}
