/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0B131D',
          card: 'rgba(15, 23, 42, 0.75)',
          glass: 'rgba(255, 255, 255, 0.08)',
        },
        sage: {
          50: '#F4F6F4',
          100: '#E5EBE5',
          200: '#C9D6C9',
          500: '#7C9082',
          600: '#687B6E',
          700: '#55655A',
        },
        accent: {
          orange: '#F97316', // Orange underline accent
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.3), 0 2px 6px -1px rgba(0, 0, 0, 0.2)',
        float: '0 12px 35px -5px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
};
