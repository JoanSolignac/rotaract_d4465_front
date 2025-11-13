module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class', // enable class-based dark mode
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          50: '#fff5fa',
          100: '#ffe7f1',
          200: '#ffc4dc',
          300: '#ff9ec5',
          400: '#ff77ae',
          500: '#c70b5c',
          600: '#a20848',
          700: '#7a0636',
          800: '#540426',
          900: '#320215'
        },
        secondary: {
          50: '#f3f4ff',
          100: '#e4e7ff',
          200: '#c5caf5',
          300: '#a4addc',
          400: '#818bbb',
          500: '#1d2449',
          600: '#161c37',
          700: '#101526',
          800: '#0b0f1b',
          900: '#070910'
        },
        accent: {
          50: '#fff3f8',
          100: '#ffe4ef',
          200: '#ffc1da',
          300: '#ff9dc4',
          400: '#f776aa',
          500: '#f27c9f',
          600: '#d55f83',
          700: '#ac4668',
          800: '#7b2f47',
          900: '#4b1c2b'
        },
        neutral: {
          50: '#fbf8fc',
          100: '#f5f6fb',
          200: '#e9ecf4',
          300: '#d7dbe7',
          400: '#bfc5d3',
          500: '#949cb2',
          600: '#6a7288',
          700: '#434857',
          800: '#272a34',
          900: '#14161d'
        }
      },
      boxShadow: {
        'hero-lg': '0 22px 60px rgba(15, 23, 42, 0.18)'
      }
    }
  },
  plugins: []
};
