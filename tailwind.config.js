module.exports = {
  mode: 'jit',
  content: [
    'components/**/*.vue',
    'filters/**/*.js',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'nuxt.config.js',
    // TypeScript
    'constants/**/*.ts',
    'filters/**/*.ts',
  ],
  safelist: ['.nuxt-link-exact-active'],
  prefix: '',
  important: false,
  separator: ':',
  theme: {},
}
