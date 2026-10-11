/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        'fade-in-slow': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-in-out',
        'fade-in-slow': 'fade-in-slow 1s ease-in-out',
        'slide-down': 'slide-down 0.5s ease-out forwards',
        'slide-down-delay': 'slide-down 0.5s ease-out 0.2s forwards',
      },
    },
  },
  plugins: [],
}
