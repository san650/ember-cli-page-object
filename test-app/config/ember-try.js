'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-lts-3.24',
        npm: {
          devDependencies: {
            'ember-source': '~3.24.3',
          },
        },
      },
      {
        name: 'ember-lts-3.28',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            '@ember/string': '^3.1.1',
            'ember-source': await getChannelURL('release'),
          },
        },
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': false,
          }),
        },
      },
      {
        name: 'ember-release-typescript-5',
        npm: {
          devDependencies: {
            '@ember/string': '^3.1.1',
            '@tsconfig/ember': '^3.0.0',
            'ember-cli-typescript': '^5.2.1',
            'ember-resolver': '^10.1.1',
            'ember-source': await getChannelURL('release'),
            typescript: '^5.1.6',
          },
        },
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': false,
          }),
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            '@ember/string': '^3.1.1',
            'ember-source': await getChannelURL('beta'),
          },
        },
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': false,
          }),
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            '@ember/string': '^3.1.1',
            'ember-source': await getChannelURL('canary'),
          },
        },
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': false,
          }),
        },
      },
      {
        name: 'ember-default-with-jquery',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': true,
          }),
        },
        npm: {
          devDependencies: {
            '@ember/jquery': '^2.0.0',
          },
        },
      },
      {
        name: 'ember-classic',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false,
          }),
        },
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
          },
          ember: {
            edition: 'classic',
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
