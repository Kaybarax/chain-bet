module.exports = {
  extends: [
    './base',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  rules: {
    // React specific rules
    'react/prop-types': 'off', // TypeScript handles prop types
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off', // TypeScript handles default props

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Accessibility rules
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      specialLink: ['to']
    }]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
