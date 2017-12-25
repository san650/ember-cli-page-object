import { AcceptanceAdapter, moduleForAcceptance, testForAcceptance } from './properties/acceptance-adapter';

import { IntegrationAdapter, moduleForIntegration, testForIntegration } from './properties/integration-adapter';

import { useNativeEvents } from 'ember-cli-page-object/extend';

export function moduleForProperty(name, cbOrOptions, cb) {
  let options = cb ? cbOrOptions : {};
  cb = cb || cbOrOptions;

  [true, false].forEach(_useNativeEvents => {
    // Generate acceptance tests

    let moduleNamePrefix = 'Acceptance mode ';
    if (_useNativeEvents) {
      moduleNamePrefix += '[native-events]';
    }

    moduleForAcceptance(`${moduleNamePrefix} | Property | ${name}`, {
      beforeEach() {
        useNativeEvents(_useNativeEvents);

        this.adapter = new AcceptanceAdapter(this);
      },

      afterEach() {
        useNativeEvents(false);
      }
    });
    cb(testForAcceptance, 'acceptance');

    // Generate integration tests

    if (!options.needsVisit) {
      moduleNamePrefix = 'Integration mode ';
      if (_useNativeEvents) {
        moduleNamePrefix += '[native-events]';
      }

      moduleForIntegration('html-render', `${moduleNamePrefix} | Property | ${name}`, {
        integration: true,
        beforeEach() {
          useNativeEvents(_useNativeEvents);

          this.adapter = new IntegrationAdapter(this);
        },
        afterEach() {
          useNativeEvents(false);
        }
      });
      cb(testForIntegration, 'integration');
    }
  });
}
