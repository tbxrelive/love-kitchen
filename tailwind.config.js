/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        'cream-dark': '#FFF0E0',
        peach: '#FFD1C1',
        'peach-light': '#FFE8DD',
        pink: '#FFB3C1',
        'pink-dark': '#FF85A2',
        'pink-deep': '#FF6B8A',
        'warm-yellow': '#FFEAA7',
        'warm-yellow-dark': '#FFD166',
        rose: '#FF6B8A',
        brown: '#8B6F5E',
        'brown-light': '#B8A59A',
        chocolate: '#6B4226',
      },
      fontFamily: {
        cute: ['"ZCOOL KuaiLe"', 'cursive'],
        body: ['"Noto Sans SC"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'cute': '0 4px 16px rgba(255, 133, 162, 0.2)',
        'cute-hover': '0 6px 24px rgba(255, 133, 162, 0.35)',
        'card': '0 2px 12px rgba(139, 111, 94, 0.1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 1.5s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'pop-in': 'pop-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.15)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.1)' },
          '60%': { transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
