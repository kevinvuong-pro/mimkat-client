module.exports = [
  ...require('eslint-config-next/core-web-vitals'),

  require('eslint-config-prettier/flat'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    settings: { react: { version: 'detect' } },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      parser: require('@typescript-eslint/parser'),
    },
    plugins: { prettier: require('eslint-plugin-prettier') },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@next/next/no-location-assign-relative-destination': 'off',
    },
  },
];
