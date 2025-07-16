module.exports = {
  ...require('./jest.config.react'),
  moduleNameMapper: {
    ...require('./jest.config.react').moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    ...require('./jest.config.react').transform,
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!.pnpm)/',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom'
};
