/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans Arabic', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FF9933',
          light: '#FFB366',
          dark: '#E67300',
        },
        secondary: {
          DEFAULT: '#5B8BA6',
          light: '#7AA3BA',
          dark: '#476D83',
        },
      },
    },
  },
  plugins: [],
};