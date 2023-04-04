module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  rules: {
    'no-console': process.env.ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.ENV === 'production' ? 'warn' : 'off',
    'vue/no-useless-v-bind': 'error',
    'vue/require-name-property': 'error',
    'vue/no-template-shadow': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/require-valid-default-prop': 'off',
    'import/named': 'warn',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/no-v-html': 'off',
  },
  plugins: ['prettier'],
  ignorePatterns: ['ps2alerts-constants/**/*'],
}
