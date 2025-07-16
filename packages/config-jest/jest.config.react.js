module.exports = {
  ...require('./jest.config.base'),
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/node_modules/@todo/config-jest/setup-tests.js'],
  moduleNameMapper: {
    ...require('./jest.config.base').moduleNameMapper,
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/node_modules/@todo/config-jest/mocks/fileMock.js'
  },
  transform: {
    ...require('./jest.config.base').transform,
    '^.+\\.svg$': 'jest-transform-stub'
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/mocks/**',
    '!src/types/**',
    '!src/test/**'
  ]
};
