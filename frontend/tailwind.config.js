/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#e0f7fa',
            100: '#b2ebf2',
            200: '#80deea',
            300: '#4dd0e1',
            400: '#26c6da',
            500: '#00bcd4',
            600: '#00acc1',
            700: '#0097a7',
            800: '#00838f',
            900: '#006064',
          },
          secondary: {
            50: '#e8eaf6',
            100: '#c5cae9',
            200: '#9fa8da',
            300: '#7986cb',
            400: '#5c6bc0',
            500: '#3f51b5',
            600: '#3949ab',
            700: '#303f9f',
            800: '#283593',
            900: '#1a237e',
          },
          accent: {
            50: '#f5f5f5',
            100: '#eeeeee',
            200: '#e0e0e0',
            300: '#bdbdbd',
            400: '#9e9e9e',
            500: '#757575',
            600: '#616161',
            700: '#424242',
            800: '#212121',
            900: '#111111',
          },
        },
      },
    },
    plugins: [],
  }
  