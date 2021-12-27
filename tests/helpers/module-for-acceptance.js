import { module } from 'qunit';
import { resolve } from 'rsvp';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import Ember from 'ember';
import { setAdapter } from 'ember-cli-page-object/test-support/adapters';
import ModuleForAcceptanceAdapter from 'ember-cli-page-object/test-support/adapters/acceptance';
import ModuleForAcceptanceNativeDOMAdapter from 'ember-cli-page-object/test-support/adapters/acceptance-native-events';
import require from 'require'

export default function(name, options = {}) {
  if (!require('ember-qunit').moduleForComponent) {
    return;
  }

  [false, true].forEach(_useNativeEvents => {
    let moduleName = name;
    if (_useNativeEvents) {
      moduleName += ' [native-events]';
    // eslint-disable-next-line no-prototype-builtins
    } else if (!Ember.hasOwnProperty('$')) {
      return;
    }

    module(moduleName, {
      beforeEach() {
        this.application = startApp();

        if (_useNativeEvents) {
          setAdapter(new ModuleForAcceptanceNativeDOMAdapter());
        } else {
          setAdapter(new ModuleForAcceptanceAdapter());
        }

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach() {
        setAdapter(null);

        let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(() => destroyApp(this.application));
      }
    });
  });
}
