/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './node_modules/flowbite.{js,ts}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'media',
  plugins: [require('flowbite/plugin')],
  colors: {
    gray: colors.gray,
    blue: colors.sky,
    red: colors.rose,
    pink: colors.fuchsia,
  },
}
