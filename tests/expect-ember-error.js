
import { run } from '@ember/runloop';
import { VERSION as EmberVersion } from '@ember/version';
import Ember from 'ember';

// ember@2.11.3 introduces a breaking change in how the errors are propagated
// in backburner which causes some test that were previously working, to fail.
//
// See https://github.com/emberjs/ember.js/pull/14898#issuecomment-285510703

// Starting from ember@2.17 this regression has been fixed
//
// See https://github.com/emberjs/ember.js/pull/15871
function useHack() {
  var [major, minor] = EmberVersion.split('.');
  major = Number(major);
  minor = Number(minor);

  return (major === 2 && minor >= 11 && minor < 17);
}

export default function expectEmberError(assert, callback, matcher, message) {
  if (useHack()) {
    let origTestAdapter = Ember.Test.adapter;
    let testError;
    let TestAdapter = Ember.Test.QUnitAdapter.extend({
      exception(error) {
        testError = error;
      }
    });

    run(() => { Ember.Test.adapter = TestAdapter.create(); });
    callback();
    run(() => {
      Ember.Test.adapter.destroy();
    });
    Ember.Test.adapter = origTestAdapter;

    assert.ok(testError && testError.message.match(matcher), message);
  } else {
    assert.throws(callback, matcher, message);
  }
}
