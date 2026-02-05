/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}'],
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
