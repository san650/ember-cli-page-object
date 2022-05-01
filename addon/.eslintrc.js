'use strict';

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
    requireConfigFile: false,
    babelOptions: {
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
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
        './.eslintrc.js',
        './.prettierrc.js',
        './index.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './node-tests/**/*.js',
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
    {
      files: ['./node-tests/**/*.js'],
      env: {
        mocha: true,
      },
    },
  ],
};
