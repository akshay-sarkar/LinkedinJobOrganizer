/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        linkedin: {
          blue: '#0A66C2',
          light: '#378FE9',
          dark: '#004182',
        },
      },
    },
  },
  plugins: [],
};
