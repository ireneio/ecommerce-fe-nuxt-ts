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
    'space-before-function-paren': 0,
    'arrow-parens': 1,
    indent: [
      'off'
      // 2,
      // {
      //   offsetTernaryExpressions: false,
      //   SwitchCase: 1,
      //   ignoreComments: true
      // }
    ],
    'no-irregular-whitespace': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
    'vue/attributes-order': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-indent': 'off',
    'vue/v-slot-style': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/html-self-closing': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'unicorn/prefer-includes': 'off'
  }
}
