module.exports = {
  purge: {
    enabled: false,
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'filters/**/*.js',
      'nuxt.config.js',
      // TypeScript
      'filters/**/*.ts',
      'nuxt.config.ts',
    ],
  },
  prefix: '',
  important: false,
  separator: ':',
  theme: {},
  corePlugins: {},
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/ui')],
}
