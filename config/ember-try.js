'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary')
  ]).then((urls) => {
    return {
      scenarios: [
        {
          name: 'ember-lts-2.4',
          bower: {
            dependencies: {
              'ember': 'components/ember#lts-2-4'
            },
            resolutions: {
              'ember': 'lts-2-4'
            }
          },
          npm: {
            devDependencies: {
              'ember-source': null
            }
          }
        },
        {
          name: 'ember-lts-2.8',
          bower: {
            dependencies: {
              'ember': 'components/ember#lts-2-8'
            },
            resolutions: {
              'ember': 'lts-2-8'
            }
          },
          npm: {
            devDependencies: {
              'ember-source': null
            }
          }
        },
        {
          name: 'ember-lts-2.12',
          npm: {
            devDependencies: {
              'ember-source': '~2.12.0'
            }
          }
        },
        {
          name: 'ember-lts-2.16',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({ 'jquery-integration': true })
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^0.5.1',
              'ember-source': '~2.16.0'
            }
          }
        },
        {
          name: 'ember-lts-2.18',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({ 'jquery-integration': true })
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^0.5.1',
              'ember-source': '~2.18.0'
            }
          }
        },
        {
          name: 'ember-release',
          npm: {
            devDependencies: {
              'ember-source': urls[0]
            }
          },
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': false
            })
          }
        },
        {
          name: 'ember-beta',
          npm: {
            devDependencies: {
              'ember-source': urls[1]
            }
          },
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': false
            })
          }
        },
        {
          name: 'ember-canary',
          npm: {
            devDependencies: {
              'ember-source': urls[2]
            }
          },
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': false
            })
          }
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {}
          }
        },
        {
          name: 'with-ember-test-helpers',
          bower: {
            dependencies: {
              'ember': 'components/ember#release'
            },
            resolutions: {
              'ember': 'release'
            }
          },
          npm: {
            devDependencies: {
              'ember-cli-qunit': '4.0.0',
              'ember-source': null,
              'ember-qunit': null
            }
          }
        },
        {
          name: 'with-@ember/test-helpers',
          bower: {
            dependencies: {
              'ember': 'components/ember#release'
            },
            resolutions: {
              'ember': 'release'
            }
          },
          npm: {
            devDependencies: {
              'ember-cli-qunit': '4.3.0',
              'ember-source': null
            }
          }
        },
        {
          name: 'with-ember-qunit@5',
          npm: {
            devDependencies: {
              'ember-source': urls[0],
              'ember-qunit': '^5.0.0',
              'qunit': '~2.14.0',
              '@ember/test-helpers': '^2.0.0',
              'ember-qunit-source-map': null,
            }
          },
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': false
            })
          }
        },
        {
          name: 'node-tests',
          command: 'npm run nodetest',
          bower: {
            dependencies: {}
          }
        },
        {
          name: 'with-jquery',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': true
            })
          }
        }
      ]
    };
  });
};
