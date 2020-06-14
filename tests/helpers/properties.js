import {
  AcceptanceAdapter,
  moduleForAcceptance,
  testForAcceptance
} from './properties/acceptance-adapter';

import {
  IntegrationAdapter,
  moduleForIntegration,
  testForIntegration
} from './properties/integration-adapter';

import ApplicationAdapter from './properties/application-adapter';
import RenderingAdapter from './properties/rendering-adapter';
import {
  setupRenderingTest,
  setupApplicationTest
} from 'ember-qunit'
import { module, test } from 'qunit';

import Ember from 'ember';
import require from 'require';
import { setAdapter } from 'ember-cli-page-object/test-support/adapters';
import ModuleForAcceptanceAdapter from 'ember-cli-page-object/test-support/adapters/acceptance';
import ModuleForIntegrationAdapter from 'ember-cli-page-object/test-support/adapters/integration';
import ModuleForAcceptanceNativeDOMAdapter from 'ember-cli-page-object/test-support/adapters/acceptance-native-events';
import ModuleForIntegrationNativeDOMAdapter from 'ember-cli-page-object/test-support/adapters/integration-native-events';

export function moduleForProperty(name, cbOrOptions, cb) {
  let options = cb ? cbOrOptions : {};
  cb = cb || cbOrOptions;

  [true, false].forEach(_useNativeEvents => {
    // Generate acceptance tests

    let moduleNamePrefix = 'Acceptance mode ';
    if (_useNativeEvents) {
      moduleNamePrefix += '[native-events]';
    } else if (!Ember.hasOwnProperty('$')) {
      return;
    }

    moduleForAcceptance(`${moduleNamePrefix} | Property | ${name}`, {
      beforeEach() {
        if (_useNativeEvents) {
          setAdapter(new ModuleForAcceptanceNativeDOMAdapter());
        } else {
          setAdapter(new ModuleForAcceptanceAdapter());
        }

        this.adapter = new AcceptanceAdapter(this);
      },

      afterEach() {
        setAdapter(null);
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
          if (_useNativeEvents) {
            setAdapter(new ModuleForIntegrationNativeDOMAdapter());
          } else {
            setAdapter(new ModuleForIntegrationAdapter());
          }

          this.adapter = new IntegrationAdapter(this);
        },
        afterEach() {
        setAdapter(null);
        }
      });
      cb(testForIntegration, 'integration');
    }
  });

  if (require.has('@ember/test-helpers')) {
    // Generate rfc268 tests

    const Rfc268Adapter = require('ember-cli-page-object/test-support/adapters/rfc268').default;

    module(`Application mode | Property | ${name}`, function(hooks) {
      setupApplicationTest(hooks);

      let adapter = new ApplicationAdapter(hooks);
      hooks.beforeEach(function() {
        this.adapter = adapter;
        setAdapter(new Rfc268Adapter());
      });
      cb(test, 'application');
    });

    if (!options.needsVisit) {
      module(`Rendering mode | Property | ${name}`, function(hooks) {
        setupRenderingTest(hooks);

        let adapter = new RenderingAdapter(hooks);
        hooks.beforeEach(function() {
          this.adapter = adapter;
          setAdapter(new Rfc268Adapter());
        });
        cb(test, 'rendering');
      });
    }
  }
}
