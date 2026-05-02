import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0a1628',
        },
        sky: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        whatsapp: {
          green: '#25D366',
          teal:  '#128C7E',
          dark:  '#075E54',
          light: '#DCF8C6',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0a1628 0%, #0d2145 50%, #1e3a8a 100%)',
        'brand-gradient-light': 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #0ea5e9 100%)',
      },
      boxShadow: {
        'brand': '0 4px 24px rgba(37, 99, 235, 0.25)',
        'brand-lg': '0 8px 40px rgba(37, 99, 235, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
