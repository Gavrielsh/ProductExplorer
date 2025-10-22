/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { es6: true, node: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react-native/no-inline-styles': 'off',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    'no-duplicate-imports': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
  ignorePatterns: [
    'android/',
    'ios/',
    'node_modules/',
    'coverage/',
    'dist/',
    'build/',
    '**/build/**',
    '**/generated/**',
  ],
};
