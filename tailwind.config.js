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
  safelist: ['.nuxt-link-exact-active', '.grayscale'],
  prefix: '',
  important: false,
  separator: ':',
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }

      '3xl': '1920px',
      // => @media (min-width: 1920px) { ... }
    },
  },
}
