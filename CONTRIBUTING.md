# Contributing to Todo List Monorepo

Thank you for your interest in contributing to the Todo List Monorepo! This document provides guidelines and instructions for contributing to this project.

## 🌟 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## 🔄 Development Workflow

### Setting Up the Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/todo-list-monorepo.git
   cd todo-list-monorepo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` files to `.env.local` in each app directory
   - Update the variables as needed for your local environment

4. **Start the development environment**
   ```bash
   # Start required services
   docker-compose -f docker-compose.dev.yml --profile db up -d
   
   # Start development servers
   pnpm dev
   ```

### Monorepo Structure

This project uses Turborepo to manage the monorepo. Here's how to work with it:

- **Running commands for specific packages/apps**:
  ```bash
  pnpm --filter @todo/web dev
  ```

- **Adding dependencies**:
  ```bash
  # Add to root
  pnpm add -D eslint
  
  # Add to specific package
  pnpm --filter @todo/web add react
  ```

### Git Workflow

1. **Create a new branch for your feature or bugfix**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit them using conventional commits**
   ```bash
   git commit -m "feat(web): add todo list component"
   ```

3. **Push your branch and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Pull Request Process

1. **Ensure your code passes all tests and linting**
   ```bash
   pnpm lint
   pnpm test
   ```

2. **Update documentation** if necessary

3. **Fill out the pull request template** with all required information

4. **Request a review** from one of the maintainers

5. **Address any feedback** from the code review

6. Once approved, a maintainer will merge your PR

## 🧪 Testing Guidelines

- Write tests for all new features and bug fixes
- Maintain or improve code coverage
- Test both success and error cases
- Use the testing utilities provided in the config packages

## 📚 Documentation Guidelines

- Update README.md if you add or change features
- Document all public APIs, components, and functions
- Add examples for complex features
- Keep documentation up-to-date with code changes

## 🏗️ Architecture Decisions

If you're making significant architectural changes:

1. Discuss the changes in an issue first
2. Create an Architecture Decision Record (ADR) in the `docs/adr` directory
3. Get consensus from the team before implementing

## 🚀 Release Process

This project follows [Semantic Versioning](https://semver.org/). The release process is automated through GitHub Actions:

1. Merge PRs to the main branch
2. CI will run tests and linting
3. If successful, a new version will be published based on conventional commits

## 🔍 Code Review Guidelines

When reviewing code, focus on:

- Functionality: Does it work as expected?
- Architecture: Is it well-designed and consistent with the project?
- Performance: Are there any performance concerns?
- Security: Are there any security vulnerabilities?
- Testing: Is it adequately tested?
- Documentation: Is it well-documented?
- Style: Does it follow the project's coding standards?

## 🙏 Thank You

Your contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.
