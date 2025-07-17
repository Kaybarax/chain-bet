# Contributing to ChainBet

We love your input! We want to make contributing to ChainBet as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, track issues and feature requests, and accept pull requests.

### Our Development Flow

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

### Setting Up Your Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/chainbet/chainbet.git
   cd chainbet
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development environment**
   ```bash
   # Start all services
   pnpm docker:dev
   
   # Or start specific services
   docker-compose -f docker-compose.dev.yml up database cache search
   ```

5. **Run database migrations and seeding**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

### Development Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications for production
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Run linting
- `pnpm lint:fix` - Fix linting issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm storybook` - Start Storybook development server
- `pnpm docker:dev` - Start development Docker services
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with test data
- `pnpm db:reset` - Reset database (drop, migrate, seed)

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit your changes**
   ```bash
   git commit -m "feat(web): add user authentication"
   ```
   
   We use [Conventional Commits](https://www.conventionalcommits.org/). Please format your commit messages accordingly:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

4. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

5. **Create a Pull Request**
   - Use our PR template
   - Include a clear description of the changes
   - Reference any related issues
   - Ensure CI passes

### Pull Request Guidelines

- **Title**: Use conventional commit format
- **Description**: Clearly describe what the PR does and why
- **Testing**: Include information about how the changes were tested
- **Breaking Changes**: Clearly mark any breaking changes
- **Documentation**: Update relevant documentation

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use Prettier for code formatting
- Prefer functional programming patterns where appropriate
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types or TypeScript interfaces
- Implement proper error boundaries
- Use Storybook for component development

### Testing

- Write unit tests for all business logic
- Write integration tests for API endpoints
- Write E2E tests for critical user flows
- Use React Testing Library for component tests
- Aim for high test coverage

### Git

- Use meaningful commit messages
- Keep commits focused and atomic
- Use feature branches for all changes
- Rebase instead of merge when possible

## Project Structure

```
chainbet/
├── apps/
│   ├── web/           # Next.js web application
│   ├── mobile/        # React Native mobile app
│   ├── api/           # Next.js API server
│   ├── ingestion/     # Data ingestion workers
│   └── contracts/     # Smart contracts
├── packages/
│   ├── ui-web/        # Web UI components
│   ├── ui-mobile/     # Mobile UI components
│   ├── services/      # Shared services
│   └── config/        # Shared configurations
├── db/
│   ├── migrations/    # Database migrations
│   └── seeds/         # Database seed data
├── scripts/           # Utility scripts
├── infrastructure/    # Infrastructure configuration
└── docs/             # Documentation
```

## Issue Guidelines

### Bug Reports

Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots or logs if applicable

### Feature Requests

Use the feature request template and include:
- Clear description of the feature
- Use cases and motivation
- Proposed implementation (if any)
- Consider alternatives

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Recognition

Contributors will be recognized in our README and release notes. Significant contributors may be invited to join the core team.

## Questions?

Feel free to reach out to the maintainers:
- Create an issue for project-related questions
- Join our Discord for real-time discussions
- Email us at dev@chainbet.com

Thank you for contributing to ChainBet! 🚀
