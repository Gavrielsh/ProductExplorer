/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { es6: true, node: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
  plugins: ['@typescript-eslint', 'prettier', 'unused-imports'],
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // Formatting
    'prettier/prettier': 'error',

    // Common React Native ergonomics
    'react-native/no-inline-styles': 'off',
    'no-console': ['warn', { allow: ['error', 'warn'] }],

    // TypeScript strictness
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': ['warn', { fixStyle: 'separate-type-imports' }],

    // Unused imports/vars cleanup
    'unused-imports/no-unused-imports': 'error',
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
