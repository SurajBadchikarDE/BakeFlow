/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F4ECE1',
          300: '#EADECF',
          400: '#DCC8B3',
        },
        cocoa: {
          50: '#FAF5F2',
          100: '#F3E9E4',
          200: '#E4CFCA',
          300: '#CDB1AA',
          400: '#A98278',
          500: '#8A5D52',
          600: '#70453B',
          700: '#57332A',
          800: '#41241D',
          900: '#2A1510',
          950: '#170A07',
        },
        peach: {
          50: '#FFF7F5',
          100: '#FEEFEA',
          200: '#FDD8CD',
          300: '#FCB9A8',
          400: '#F88A6E',
          500: '#EE603D',
          600: '#DC4420',
        },
        roseGold: {
          50: '#FBF5F4',
          100: '#F6EAE8',
          200: '#EED3CF',
          300: '#E2B5AE',
          400: '#D4948A',
          500: '#C27468',
          600: '#A75549',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E6ECE8',
          200: '#CBD8CF',
          300: '#A5BEAE',
          400: '#7E9F8B',
          500: '#5F826E',
          600: '#496756',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(42, 21, 16, 0.05), 0 4px 6px -2px rgba(42, 21, 16, 0.02)',
        'card': '0 4px 20px -2px rgba(42, 21, 16, 0.06), 0 2px 6px -1px rgba(42, 21, 16, 0.03)',
        'elevated': '0 12px 30px -4px rgba(42, 21, 16, 0.1), 0 4px 10px -2px rgba(42, 21, 16, 0.05)',
        'glow': '0 0 25px -5px rgba(238, 96, 61, 0.25)',
      }
    },
  },
  plugins: [],
}


