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
  theme: {
    extend: {
      blur: {
        xs: '2px',
      },
      keyframes: {
        alert: {
          '0%': {
            filter: 'blur(2px)',
            opacity: 0.5,
            width: '28px',
            left: '-2px',
          },
          '50%': {
            filter: 'blur(4px)',
            opacity: 1,
            width: '28px',
            left: '-2px',
          },
          '100%': {
            filter: 'blur(0)',
          },
        },
        'alert-small': {
          '0%': {
            filter: 'blur(2px)',
            opacity: 0.5,
            width: '14px',
            left: '-1px',
          },
          '50%': {
            filter: 'blur(4px)',
            opacity: 1,
            width: '14px',
            left: '-1px',
          },
          '100%': {
            filter: 'blur(0)',
          },
        },
      },
      animation: {
        alert: 'alert 1s linear infinite alternate',
        'alert-small': 'alert-small 1s linear infinite alternate',
      },
    },
  },
}
