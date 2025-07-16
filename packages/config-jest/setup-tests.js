// This file is used to set up the testing environment for React components

// Add Jest DOM matchers
require('@testing-library/jest-dom');

// Mock global objects that might not be available in the test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Suppress console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/i.test(args[0]) ||
    /Warning.*ReactDOM.render is no longer supported/i.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
