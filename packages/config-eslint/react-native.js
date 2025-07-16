module.exports = {
  extends: [
    './react',
    'plugin:react-native/all'
  ],
  plugins: ['react-native'],
  env: {
    'react-native/react-native': true
  },
  rules: {
    // React Native specific rules
    'react-native/no-unused-styles': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': ['error', { skip: ['Button', 'Text'] }],
    'react-native/no-single-element-style-arrays': 'error',

    // Accessibility
    'react-native/accessibility-label': 'error',

    // Override React rules for React Native
    'jsx-a11y/accessible-emoji': 'off', // React Native handles emoji accessibility
    'jsx-a11y/anchor-is-valid': 'off', // Not applicable in React Native

    // Performance
    'react/jsx-no-bind': ['warn', {
      ignoreDOMComponents: true,
      ignoreRefs: true,
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false
    }]
  }
};
