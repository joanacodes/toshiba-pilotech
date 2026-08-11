/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./_layouts/**/*.html","./_includes/**/*.html","./*.html","./gammes/**/*.html","./blog/**/*.html"],
  theme: { extend: {
    fontFamily: { sans: ['Inter','sans-serif'] },
    colors: { primary: '#E31837', 'primary-dark': '#b5122b', secondary: '#000000', dark: '#1A1A1A', light: '#F5F5F5', darker: '#0D0D0D', accent: '#E31837', textgray: '#6B7280' },
  } },
  plugins: [],
};
