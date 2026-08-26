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
          DEFAULT: '#FBF9F5',
          card: '#FFFFFF',
          secondary: '#F5F2EC',
        },
        sage: {
          50: '#F4F6F4',
          100: '#E5EBE5',
          200: '#C9D6C9',
          500: '#7C9082',
          600: '#687B6E',
          700: '#55655A',
        },
        ink: {
          primary: '#2B2927',
          secondary: '#7A7672',
          muted: '#A5A09A',
          border: '#EDE9E2',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px -2px rgba(43, 41, 39, 0.04), 0 1px 3px 0 rgba(43, 41, 39, 0.02)',
        float: '0 10px 30px -5px rgba(43, 41, 39, 0.08), 0 4px 12px -2px rgba(43, 41, 39, 0.04)',
      }
    },
  },
  plugins: [],
};
