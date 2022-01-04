'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function () {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary'),
  ]).then((urls) => {
    return {
      scenarios: [
        {
          name: 'ember-lts-2.12',
          npm: {
            devDependencies: {
              'ember-source': '~2.12.0',
              'ember-cli-qunit': '^4.0.0',
              'ember-qunit': null,
            },
          },
        },
        {
          name: 'ember-lts-2.16',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': true,
            }),
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^0.5.1',
              'ember-source': '~2.16.0',
              'ember-cli-qunit': '^4.0.0',
              'ember-qunit': null,
            },
          },
        },
        {
          name: 'ember-lts-2.18',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': true,
            }),
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^0.5.1',
              'ember-source': '~2.18.0',
            },
          },
        },
        {
          name: 'ember-lts-3.28',
          npm: {
            devDependencies: {
              'ember-source': '~3.28.0',
              'ember-resolver': '^8.0.0',
            },
          },
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': false,
            }),
          },
        },

        {
          name: 'ember-release',
          npm: {
            devDependencies: {
              'ember-source': urls[0],
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
              'ember-source': urls[1],
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
              'ember-source': urls[2],
            },
          },
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': false,
            }),
          },
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {},
          },
        },
        {
          name: 'node-tests',
          command: 'npm run nodetest',
          bower: {
            dependencies: {},
          },
        },
        {
          name: 'with-jquery',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': true,
            }),
          },
        },
      ],
    };
  });
};
