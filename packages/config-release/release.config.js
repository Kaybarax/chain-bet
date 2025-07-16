/**
 * Semantic Release configuration
 * This file defines the rules for versioning and publishing packages
 */

module.exports = {
  branches: ['main'],
  plugins: [
    // Analyze commits to determine the type of release
    ['@semantic-release/commit-analyzer', {
      preset: 'conventionalcommits',
      releaseRules: [
        { type: 'feat', release: 'minor' },
        { type: 'fix', release: 'patch' },
        { type: 'docs', release: 'patch' },
        { type: 'style', release: 'patch' },
        { type: 'refactor', release: 'patch' },
        { type: 'perf', release: 'patch' },
        { type: 'test', release: 'patch' },
        { type: 'build', release: 'patch' },
        { type: 'ci', release: 'patch' },
        { type: 'chore', release: 'patch' },
        { scope: 'breaking', release: 'major' },
        { type: 'breaking', release: 'major' },
        { type: 'BREAKING CHANGE', release: 'major' }
      ],
      parserOpts: {
        noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
      }
    }],

    // Generate release notes
    ['@semantic-release/release-notes-generator', {
      preset: 'conventionalcommits',
      presetConfig: {
        types: [
          { type: 'feat', section: 'Features' },
          { type: 'fix', section: 'Bug Fixes' },
          { type: 'docs', section: 'Documentation' },
          { type: 'style', section: 'Styles' },
          { type: 'refactor', section: 'Code Refactoring' },
          { type: 'perf', section: 'Performance Improvements' },
          { type: 'test', section: 'Tests' },
          { type: 'build', section: 'Build System' },
          { type: 'ci', section: 'Continuous Integration' },
          { type: 'chore', section: 'Chores' }
        ]
      }
    }],

    // Update the changelog
    ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md'
    }],

    // Update the package version
    '@semantic-release/npm',

    // Commit the changes
    ['@semantic-release/git', {
      assets: ['package.json', 'CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],

    // Create a GitHub release
    '@semantic-release/github'
  ]
};
