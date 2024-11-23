/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: [
        { accentColor: '#FC504D' },
        { 'xmas-green': '#228B22' },
        { 'xmas-red': '#D64045' },
        { 'xmas-gold': '#FFB84C' },
        { 'purple-light': '#A084DC' },
        { 'purple-deep': '#583C87' },
        { 'pinkish-ivory': '#FFF4E6' },
      ],
    },
  },
  plugins: [],
};
