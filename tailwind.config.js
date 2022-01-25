module.exports = {
  mode: 'jit',
  purge: {
    enabled: true,
    content: [
      'constants/**/*.ts',
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
