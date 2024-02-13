const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['"Inter"', 'sans serif']
      },
      colors: {
        primary: {
          '50': '#fff5fb', 
          '100': '#ffedf8', 
          '200': '#ffcfe8', 
          '300': '#fcb1d5', 
          '400': '#fc79ab', 
          '500': '#fb3f72', 
          '600': '#e0345f', 
          '700': '#ba2347', 
          '800': '#961732', 
          '900': '#700c20', 
          '950': '#470510'
        },
        secondary: {
          '50': '#fcfaf7', 
          '100': '#faf6f2', 
          '200': '#f2e7df', 
          '300': '#e8d3ca', 
          '400': '#d9b0a7', 
          '500': '#c68684', 
          '600': '#b36d6b', 
          '700': '#944c4a', 
          '800': '#783230', 
          '900': '#591c1b', 
          '950': '#3b0c0b'
        }
        // indigo: {
        //   600: '#AAAAAA'
        // }
      }
    },
  },
}