/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // Enable dark mode with class strategy
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
