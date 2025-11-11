/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral': {
          'lightest': '#F8F6F3',
          'lighter': '#F0EDE8',
          'light': '#E8E4DE',
          'medium': '#D2CCC4',
          'dark': '#B8B2A8',
          'darker': '#8B857B',
          'darkest': '#5A5550',
          'charcoal': '#3B3935',
          'accent': '#A39080',
        },
        'orange': {
          'DEFAULT': '#FF6B35',
          'light': '#FF8C61',
          'dark': '#E55A2B',
        }
      },
      fontFamily: {
        'barlow': ['Barlow', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Barlow', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
