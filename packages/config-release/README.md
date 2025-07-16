# Semantic Release Configuration

This package provides shared semantic-release configuration for the Todo List Monorepo.

## Overview

The configuration in this package is designed to standardize the versioning and release process across all packages in the monorepo. It follows the [Conventional Commits](https://www.conventionalcommits.org/) specification and automates the versioning, changelog generation, and release process.

## Usage

### In package.json

To use this configuration in a package, add the following to your `package.json`:

```json
{
  "release": {
    "extends": "@todo/config-release"
  }
}
```

### In release.config.js

Alternatively, you can create a `release.config.js` file in your package:

```js
module.exports = require('@todo/config-release').releaseConfig;
```

## Release Rules

The configuration includes the following release rules:

| Commit Type | Release Type | Example                                  |
|-------------|--------------|------------------------------------------|
| feat        | minor        | feat: add new todo filtering feature     |
| fix         | patch        | fix: resolve issue with todo creation    |
| docs        | patch        | docs: update API documentation           |
| style       | patch        | style: format code according to standards|
| refactor    | patch        | refactor: improve todo service structure |
| perf        | patch        | perf: optimize database queries          |
| test        | patch        | test: add tests for todo service         |
| build       | patch        | build: update build configuration        |
| ci          | patch        | ci: configure GitHub Actions workflow    |
| chore       | patch        | chore: update dependencies               |
| *           | major        | feat!: change API interface              |
| *           | major        | feat: add new feature\n\nBREAKING CHANGE: This changes the API |

Any commit with a scope of "breaking", a type of "breaking", or a footer containing "BREAKING CHANGE" will trigger a major release.

## Plugins

This configuration uses the following semantic-release plugins:

1. **@semantic-release/commit-analyzer**: Analyzes commits to determine the release type
2. **@semantic-release/release-notes-generator**: Generates release notes based on commits
3. **@semantic-release/changelog**: Updates the CHANGELOG.md file
4. **@semantic-release/npm**: Updates the package version in package.json
5. **@semantic-release/git**: Commits the changes to package.json and CHANGELOG.md
6. **@semantic-release/github**: Creates a GitHub release

## CI/CD Integration

This configuration is designed to work with the GitHub Actions workflows defined in the `.github/workflows` directory. The release process is triggered automatically when commits are pushed to the main branch.
