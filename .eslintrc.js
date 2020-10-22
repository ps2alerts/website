module.exports = {
  root: true,
  env: {
    node: true,
    jquery: true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: '@typescript-eslint/parser',
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    'vue/component-name-in-template-casing': 'error',
    'vue/html-comment-indent': 'error',
    'vue/no-useless-mustaches': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/require-name-property': 'error',
    'vue/script-indent': 'error'
  }
};
