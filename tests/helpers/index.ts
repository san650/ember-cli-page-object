import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
} from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import require from 'require';
import { TestContext as DefaultTestContext } from 'ember-test-helpers';

import $ from 'jquery';

export interface TestContext extends DefaultTestContext {
  [k: string]: unknown;

  createTemplate(
    template: string,
    options?: {
      useAlternateContainer?: boolean
    }
  ): Promise<unknown>

  findExternal(selector: string): JQuery;
}

function render(...args: unknown[]) {
  return require('@ember/test-helpers').render(...args);
}

export function setupApplicationTest(hooks: NestedHooks) {
  upstreamSetupApplicationTest(hooks);

  hooks.afterEach(function() {
    document.getElementById('alternate-ember-testing')!.innerHTML = '';
  })
}

export function setupRenderingTest(hooks: NestedHooks) {
  upstreamSetupRenderingTest(hooks);

  hooks.beforeEach(function(this: TestContext) {
    const testContext = this;

    this.createTemplate = function(template, options): Promise<unknown> {
      if (options && options.useAlternateContainer) {
        // The idea is to render the HTML outside the testing container so we
        // render an empty component
        $('#alternate-ember-testing').html(template);
        testContext.set('raw', '');
      } else {
        testContext.set('raw', template);
      }

      return render(hbs`{{html-render html=this.raw}}`);
    }

    this.findExternal = function(selector: string): JQuery {
      return $(selector, '#alternate-ember-testing');
    }
  });

  hooks.afterEach(function() {
    document.getElementById('alternate-ember-testing')!.innerHTML = '';
  })
}

export { setupTest } from 'ember-qunit';
