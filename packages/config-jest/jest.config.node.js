module.exports = {
  ...require('./jest.config.base'),
  testEnvironment: 'node',
  moduleNameMapper: {
    ...require('./jest.config.base').moduleNameMapper
  },
  transform: {
    ...require('./jest.config.base').transform
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/mocks/**'
  ],
  testMatch: [
    '**/__tests__/**/*.test.[jt]s',
    '**/?(*.)+(spec|test).[jt]s'
  ],
  // For testing with MongoDB
  globalSetup: '<rootDir>/src/test/setup.ts',
  globalTeardown: '<rootDir>/src/test/teardown.ts'
};
