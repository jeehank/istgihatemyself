/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'calibri': ['Calibri', 'sans-serif'],
      },
      colors: {
        'xaviers-blue': '#1e3a8a',
        'xaviers-gold': '#f59e0b',
      },
    },
  },
  plugins: [],
}
