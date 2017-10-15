import Ember from 'ember';
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import { start } from 'ember-cli-qunit';

setResolver(resolver);


// ember@2.11.3 introduces a (breaking?) change in how the errors are propagated
// in backburner which causes some test that were previously working, to fail.
//
// See https://github.com/emberjs/ember.js/pull/14898#issuecomment-285510703

// We need to use this hack to test with >= 2.11
function useHack() {
  var [major, minor] = Ember.VERSION.split('.');
  major = Number(major);
  minor = Number(minor);

  return (major === 2 && minor >= 11) || major > 2;
}

export function expectEmberError(assert, callback, matcher, message) {
  if (useHack()) {
    let origTestAdapter = Ember.Test.adapter;
    let testError;
    let TestAdapter = Ember.Test.QUnitAdapter.extend({
      exception(error) {
        testError = error;
      }
    });

    Ember.run(() => { Ember.Test.adapter = TestAdapter.create(); });
    callback();
    Ember.run(() => {
      Ember.Test.adapter.destroy();
    });
    Ember.Test.adapter = origTestAdapter;

    assert.ok(testError && testError.message.match(matcher), message);
  } else {
    assert.throws(callback, matcher, message);
  }
}

start();
