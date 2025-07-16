module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-enum': [
      2,
      'always',
      [
        'web',
        'mobile',
        'api',
        'ingestion',
        'contracts',
        'ui-web',
        'ui-mobile',
        'services',
        'config',
        'deps',
        'release',
        'docs',
        'ci',
        'infra',
        'db'
      ]
    ]
  }
};
