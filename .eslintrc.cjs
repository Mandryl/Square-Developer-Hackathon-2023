/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env:{
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  plugins: ["etc"],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules:{
    "etc/no-commented-out-code": "error"
  }
}
