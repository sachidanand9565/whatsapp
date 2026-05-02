/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#25D366',
          teal:  '#128C7E',
          dark:  '#075E54',
          light: '#DCF8C6',
        },
      },
    },
  },
  plugins: [],
};
