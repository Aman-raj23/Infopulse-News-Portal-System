/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          light: '#60a5fa',
          dark: '#1d4ed8'
        }
      },
      boxShadow: {
        card: '0 20px 40px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
