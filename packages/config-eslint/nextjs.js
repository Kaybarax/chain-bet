module.exports = {
  extends: [
    './react',
    'next/core-web-vitals'
  ],
  rules: {
    // Next.js specific rules
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn', // Prefer next/image

    // Override React rules for Next.js
    'jsx-a11y/anchor-is-valid': 'off', // Next.js handles this differently

    // Additional rules for Next.js
    'import/no-anonymous-default-export': 'warn'
  },
  settings: {
    next: {
      rootDir: ['apps/api/']
    }
  }
};
