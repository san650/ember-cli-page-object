import { module } from 'qunit';
import { resolve } from 'rsvp';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import { useNativeDOMHelpers } from 'ember-cli-page-object/extend';

export default function(name, options = {}) {
  [false, true].forEach(_useNativeDOMHelpers => {
    let moduleName = name;
    if (_useNativeDOMHelpers) {
      moduleName += ' [native-dom-helpers]';
    }

    module(moduleName, {
      beforeEach() {
        this.application = startApp();

        useNativeDOMHelpers(_useNativeDOMHelpers);

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach() {
        useNativeDOMHelpers(false);

        let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(() => destroyApp(this.application));
      }
    });
  });
}
