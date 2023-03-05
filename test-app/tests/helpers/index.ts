import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
} from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { TestContext as DefaultTestContext } from 'ember-test-helpers';
import { render } from '@ember/test-helpers';

export interface TestContext extends DefaultTestContext {
  [k: string]: unknown;

  createTemplate(
    template: string,
    options?: {
      useAlternateContainer?: boolean
    }
  ): Promise<unknown>

  findExternal<T extends HTMLElement>(selector: string): T | null;
}

function getAlternateContainer() {
  const element = document.getElementById('alternate-ember-testing');
  if (!element) {
    throw new Error('Can not find an alternative element');
  }

  return element;
}

export function setupApplicationTest(hooks: NestedHooks) {
  upstreamSetupApplicationTest(hooks);

  hooks.afterEach(function() {
    getAlternateContainer().innerHTML = '';
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
        getAlternateContainer().innerHTML = template;
        testContext.set('raw', '');
      } else {
        testContext.set('raw', template);
      }

      return render(hbs`{{html-render html=this.raw}}`);
    }

    this.findExternal = function(selector: string) {
      return getAlternateContainer().querySelector(selector);
    }
  });

  hooks.afterEach(function() {
    getAlternateContainer().innerHTML = '';
  })
}

export { setupTest } from 'ember-qunit';
