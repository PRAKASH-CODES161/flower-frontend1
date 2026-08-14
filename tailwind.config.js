/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mint-light': '#fdf2f8', // light pink background
        'mint-primary': '#c75b87', // user requested color
        'mint-dark': '#9d174d', // darker pink
        glass: 'rgba(255, 255, 255, 0.7)',
        'glass-border': 'rgba(255, 255, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
