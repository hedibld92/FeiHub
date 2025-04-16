/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          950: '#0a0a0a',  // Noir profond
          900: '#121212',  // Noir sophistiqué
          800: '#1a1a1a',  // Gris très foncé
          700: '#242424',  // Gris foncé
          600: '#2d2d2d',  // Gris moyen-foncé
          500: '#363636',  // Gris moyen
          400: '#4a4a4a',  // Gris clair
          300: '#606060',  // Gris très clair
          200: '#909090',  // Texte secondaire
          100: '#f0f0f0',  // Texte principal
        },
        'accent': {
          DEFAULT: '#3b82f6',  // Bleu principal
          hover: '#2563eb',    // Bleu hover
          light: '#60a5fa',    // Bleu clair
          dark: '#1d4ed8',     // Bleu foncé
        },
        'success': '#10b981',  // Vert
        'warning': '#f59e0b',  // Orange
        'error': '#ef4444',    // Rouge
      },
      boxShadow: {
        'soft': '0 0 20px rgba(0, 0, 0, 0.1)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} 