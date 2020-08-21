module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'standard'
  ],
  // add your custom rules here
  rules: {
    'linebreak-style': 0,
    'space-before-function-paren': 0
  }
}
