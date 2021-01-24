import Rfc268Adapter from './rfc268-adapter';
import require from 'require';
import { run } from '@ember/runloop';
import { $ } from 'ember-cli-page-object/test-support/-private/helpers';

function visit(...args) {
  return require('@ember/test-helpers').visit(...args);
}

function currentURL(...args) {
  return require('@ember/test-helpers').currentURL(...args);
}

export default function ApplicationAdapter(hooks) {
  Rfc268Adapter.call(this, hooks);

  let adapter = this;
  hooks.beforeEach(function() {
    adapter.testContext = this;
  });

  hooks.afterEach(function() {
    // Cleanup DOM
    $('#alternate-ember-testing').html('');
  });
}

ApplicationAdapter.prototype = Object.create(Rfc268Adapter.prototype);

Object.assign(ApplicationAdapter.prototype, {
  name: 'application',

  async createTemplate(test, page, template = '', { useAlternateContainer } = {}) {
    if (!(test && page)) {
      console.error('Missing parameters in adapter.createTemplate(testContext, pageObject, templateString)');
    }

    await visit('/html-render');

    if (useAlternateContainer) {
      $('#alternate-ember-testing').html(template);
    } else {
      run(() => this.testContext.owner.lookup('controller:html-render').set('html', template));
    }
  },

  currentURL() {
    return currentURL();
  }
});
