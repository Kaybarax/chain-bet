# Testing Strategy

This document outlines the testing strategy for the Todo List Monorepo project.

## Overview

The project employs a comprehensive testing approach with multiple layers:

1. **Unit Tests**: Testing individual components and functions in isolation
2. **Integration Tests**: Testing interactions between components and services
3. **End-to-End (E2E) Tests**: Testing complete user flows from UI to database
4. **Visual Regression Tests**: Ensuring UI components maintain their appearance
5. **Smart Contract Tests**: Verifying the correctness of blockchain contracts

## Test Coverage

All packages and applications aim for 100% test coverage. Coverage reports are generated during test runs and can be viewed locally or on Codecov.

## Running Tests

### Unit and Integration Tests

To run all tests across the monorepo:

```bash
npm test
```

To run tests for a specific package or app:

```bash
npm test --filter=@todo/web
npm test --filter=@todo/api
npm test --filter=@todo/services
```

To run tests with coverage:

```bash
npm test -- --coverage
```

### End-to-End Tests

E2E tests are implemented using Playwright and are located in the `apps/web/e2e` directory.

To run E2E tests:

```bash
cd apps/web
npm run test:e2e
```

To run E2E tests with the Playwright UI:

```bash
cd apps/web
npm run test:e2e:ui
```

### Visual Regression Tests

Visual regression tests are implemented using Storybook and Chromatic. Storybook stories are located in the component directories.

To run Storybook locally:

```bash
cd packages/ui-web
npm run storybook
```

Chromatic tests run automatically on GitHub Actions when changes are pushed to the main branch or when a pull request is opened.

### Smart Contract Tests

Smart contract tests are located in the `apps/contracts/test` directory and use Hardhat to test the smart contracts in a local blockchain environment.

The test structure follows the standard Hardhat testing pattern:
- `apps/contracts/test/TodoList.test.ts` - Tests for the TodoList smart contract

To run smart contract tests:

```bash
cd apps/contracts
npm test
```

To run smart contract tests with coverage:

```bash
cd apps/contracts
npm run coverage
```

To deploy smart contracts to a local or test network:

```bash
cd apps/contracts
npm run deploy
# or for Moonbase Alpha testnet
npm run deploy:moonbase
```

## Test Structure

### Unit and Integration Tests

Unit and integration tests are located in `__tests__` directories adjacent to the code they test. For example:

- `packages/ui-web/src/components/Button/__tests__/Button.test.tsx`
- `packages/services/src/todo/__tests__/todoService.test.ts`
- `apps/api/src/models/__tests__/Todo.test.ts`

### End-to-End Tests

E2E tests are located in the `apps/web/e2e` directory and use Playwright to simulate user interactions with the application.

### Visual Regression Tests

Visual regression tests are implemented as Storybook stories located alongside the components they test. For example:

- `packages/ui-web/src/components/Button/Button.stories.tsx`

### Smart Contract Tests

Smart contract tests are located in the `apps/contracts/test` directory and follow the Hardhat testing pattern. Each contract has its own test file:

- `apps/contracts/test/TodoList.test.ts`

The tests use Hardhat's testing framework with Chai assertions and ethers.js for interacting with the contracts. Tests are organized into describe blocks for different contract features (creation, retrieval, updates, deletion).

## Continuous Integration

Tests run automatically on GitHub Actions when changes are pushed to the main branch or when a pull request is opened. The CI workflow includes:

1. Linting
2. Type checking
3. Unit and integration tests with coverage reporting
4. E2E tests
5. Smart contract tests
6. Visual regression tests with Chromatic

## Test Configuration

Test configuration is shared across the monorepo using the following packages:

- `packages/config-jest`: Jest configuration for unit and integration tests
- `apps/web/playwright.config.ts`: Playwright configuration for E2E tests
- `.github/workflows/ci.yml`: CI workflow configuration
- `.github/workflows/chromatic.yml`: Chromatic workflow configuration

## Mocking

The project uses various mocking strategies:

- **API Mocks**: Using Jest mock functions and MSW (Mock Service Worker)
- **Database Mocks**: Using mongodb-memory-server for MongoDB and redis-mock for Redis
- **Blockchain Mocks**: Using Hardhat for local blockchain testing

## Best Practices

1. Write tests before or alongside code (TDD/BDD approach)
2. Keep tests simple and focused on a single behavior
3. Use descriptive test names that explain the expected behavior
4. Avoid testing implementation details; focus on behavior
5. Maintain high test coverage, especially for critical paths
6. Use the testing pyramid: more unit tests, fewer E2E tests
7. Keep tests fast and reliable to encourage frequent running
