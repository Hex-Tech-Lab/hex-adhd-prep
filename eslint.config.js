const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'build/**', 'coverage/**'],
  },
  js.configs.recommended,
  {
    rules: {
      'no-undef': 'error',
    },
  },
];