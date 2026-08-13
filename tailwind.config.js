/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mint-light': '#F7FFFC',
        'mint-primary': '#8CCDB6',
        'mint-dark': '#5c9983',
        glass: 'rgba(255, 255, 255, 0.7)',
        'glass-border': 'rgba(255, 255, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
