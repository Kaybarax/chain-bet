# Todo List Monorepo

A comprehensive monorepo template as a simple Todo List application, built with modern technologies and best practices.

## 🚀 Features

- **Monorepo Structure**: Managed by Turborepo for efficient builds and dependency management
- **Web App**: React with Vite for fast development and optimized production builds
- **Mobile App**: React Native with Expo for cross-platform mobile development
- **API**: Next.js 14 with App Router for server-side rendering and API routes
- **Data Ingestion**: Workers for processing and transforming data
- **Smart Contracts**: Polkadot-EVM compatible contracts
- **Shared Packages**: UI components, services, and configuration
- **Database**: MongoDB for data storage with schema versioning
- **Search**: Elasticsearch for advanced search capabilities
- **Caching**: Redis for performance optimization
- **Testing**: Comprehensive testing strategy with Jest, Playwright, and Chromatic
- **DevOps**: Docker, GitHub Actions, and Kubernetes

## 📦 Repository Structure

```
.
├── apps/
│   ├── web/                 # React-Vite app
│   ├── mobile/              # Expo RN app
│   ├── api/                 # Next.js 14 backend (routes/, app/)
│   ├── ingestion/           # Data-ingestion workers
│   └── contracts/           # Polkadot-EVM smart contracts
├── packages/
│   ├── ui-web/              # React component library + Storybook
│   ├── ui-mobile/           # RN component library + Storybook
│   ├── services/            # Shared domain & util code
│   ├── config-eslint/       # Shared ESLint preset
│   ├── config-ts/           # Base tsconfig, paths
│   ├── config-jest/         # Jest + testing-library
│   └── config-release/      # semantic-release rules
├── db/
│   ├── migrations/          # Mongo / ES migration files
│   └── seed-todos.js
├── .github/
│   ├── workflows/
│   ├── dependabot.yml       # Automated security bumps
│   └── codeql.yml           # Code scanning
├── docs/                    # Docusaurus or Storybook docs site
├── scripts/                 # startDev.* etc.
├── devcontainer/
├── infra/                   # IaC (K8s)
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── docker-compose*.yml
├── .nvmrc                   # Node version pin
├── .dockerignore            # Speeds up builds
├── .editorconfig            # Consistent editor rules
├── .lintstagedrc.cjs        # Pre-commit formatting
├── .commitlintrc.cjs        # Conventional commits
├── LICENSE                  # OSS or proprietary
├── CONTRIBUTING.md          # How to get started
├── SECURITY.md              # Vulnerability disclosure
└── README.md
```

## 🏗️ Monorepo Architecture

This project uses a monorepo architecture powered by pnpm workspaces and Turborepo:

### pnpm Workspaces

The monorepo uses pnpm workspaces to manage dependencies across multiple packages and applications. The workspace configuration is defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This allows for:
- Shared dependencies across packages
- Local package linking (packages can depend on each other without publishing)
- Efficient installation with a single `pnpm install` command
- Consistent dependency versions across the entire project

### Turborepo

Turborepo is used for build orchestration and task running. The configuration in `turbo.json` defines:

- Task dependencies (what needs to run before what)
- Caching rules for faster builds
- Output artifacts for each task
- Development mode configurations

Key tasks defined in Turborepo:
- `build`: Builds all packages and applications
- `dev`: Starts development servers
- `test`: Runs tests across the monorepo
- `lint`: Runs linters across the monorepo
- `format`: Formats code using Prettier
- `clean`: Cleans build artifacts
- `deploy`: Handles deployment (depends on build, test, and lint)
- `storybook`: Starts Storybook development servers
- `build-storybook`: Builds static Storybook sites

To run a task for a specific package:
```bash
pnpm --filter <package-name> <task>
```

Example:
```bash
# Run tests only for the web app
pnpm --filter @todo/web test

# Start development server for the API
pnpm --filter @todo/api dev
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (see .nvmrc for version)
- Docker and Docker Compose
- pnpm (required)

### Installation

1. Install pnpm if you don't have it already
   ```bash
   npm install -g pnpm@8.15.4
   ```

2. Clone the repository
   ```bash
   git clone https://github.com/yourusername/todo-list-monorepo.git
   cd todo-list-monorepo
   ```

3. Install dependencies
   ```bash
   pnpm install
   ```

4. Start the development environment
   ```bash
   # Start all services
   docker-compose -f docker-compose.dev.yml up -d

   # Start only specific services
   docker-compose -f docker-compose.dev.yml --profile api --profile web up -d

   # Start the development servers
   pnpm dev
   ```

### Development Workflow

- **Build all packages and apps**:
  ```bash
  pnpm build
  ```

- **Run tests**:
  ```bash
  pnpm test
  ```

- **Lint code**:
  ```bash
  pnpm lint
  ```

- **Format code**:
  ```bash
  pnpm format
  ```

## 🧪 Testing

The project uses a comprehensive testing strategy:

- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright for web and API
- **Visual Regression**: Chromatic for UI components
- **Smart Contract Tests**: Hardhat with Moonbeam local node

Run tests with:

```bash
# Run all tests
pnpm test

# Run tests for a specific app or package
pnpm --filter @todo/web test

# Run E2E tests
cd apps/web
pnpm test:e2e
```

For detailed information about the testing strategy, test structure, and best practices, see [docs/testing.md](docs/testing.md).

## 📚 Documentation

- Component documentation is available through Storybook
  ```bash
  # Start Storybook for web components
  pnpm --filter @todo/ui-web storybook
  ```

- API documentation is available at `/api/docs` when running the API server

## 🚢 Deployment

The project uses GitHub Actions for CI/CD:

- **CI**: Runs on every pull request to validate code quality and tests
- **CD**: Deploys to staging and production environments on merge to main branch

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 🔒 Security

If you discover a security vulnerability, please follow the guidelines in [SECURITY.md](SECURITY.md).
