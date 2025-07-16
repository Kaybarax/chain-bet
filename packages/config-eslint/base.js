module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],

    // Import rules
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index'
        ],
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
      }
    ],
    'import/no-duplicates': 'error',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always', { 'null': 'ignore' }]
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  env: {
    node: true,
    browser: true,
    es6: true
  }
};
