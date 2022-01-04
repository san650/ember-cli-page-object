'use strict';

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'ember/no-global-jquery': 0,
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
  overrides: [
    // node files
    {
      files: [
        'docs.js',
        '.eslintrc.js',
        '.prettierrc.js',
        '.template-lintrc.js',
        'babel.config.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    // dummy app @todo update all dummy app code to octane patterns
    {
      files: ['tests/dummy/app/**/*.js'],
      rules: {
        'ember/no-classic-classes': 0,
        'ember/no-classic-components': 0,
        'ember/no-actions-hash': 0,
        'ember/require-tagless-components': 0,
      },
    },
  ],
};
