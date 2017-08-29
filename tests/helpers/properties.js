import AcceptanceExecutionContext from 'ember-cli-page-object/-private/execution_context/acceptance';
import IntegrationExecutionContext from 'ember-cli-page-object/-private/execution_context/integration';
import { AcceptanceAdapter, moduleForAcceptance, testForAcceptance } from './properties/acceptance-adapter';

import { IntegrationAdapter, moduleForIntegration, testForIntegration } from './properties/integration-adapter';

import { useNativeDOMHelpers } from 'ember-cli-page-object/extend';

export function moduleForProperty(name, cbOrOptions, cb) {
  let options = cb ? cbOrOptions : {};
  cb = cb || cbOrOptions;

  [true, false].forEach(_useNativeDOMHelpers => {
    // Generate acceptance tests

    let moduleNamePrefix = 'Acceptance mode ';
    if (_useNativeDOMHelpers) {
      moduleNamePrefix += ' [native-dom-helpers]';
    }
    moduleForAcceptance(`${moduleNamePrefix} | Property | ${name}`, {
      beforeEach() {
        useNativeDOMHelpers(_useNativeDOMHelpers);

        // if (!_useNativeDOMHelpers) {
          this.adapter = new AcceptanceAdapter(AcceptanceExecutionContext);
        // }
      },

      afterEach() {
        useNativeDOMHelpers(false);
        this.adapter.revert();
      }
    });
    cb(testForAcceptance, 'acceptance');

    if (options.acceptanceOnly) {
      return;
    }

    // Generate integration tests
    moduleForIntegration('html-render', `Integration mode | Property | ${name}`, {
      integration: true,
      beforeEach() {
        useNativeDOMHelpers(_useNativeDOMHelpers);
        // if (!_useNativeDOMHelpers) {
          this.adapter = new IntegrationAdapter(IntegrationExecutionContext);
        // }
      },
      afterEach() {
        useNativeDOMHelpers(false);
        this.adapter.revert();
      }
    });
    cb(testForIntegration, 'integration');
  });
}
