import require from 'require';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  create,
  property,
  value
} from 'ember-cli-page-object';

if (require.has('@ember/test-helpers')) {
  const { render } = require('@ember/test-helpers');

  module('native getter', function(hooks) {
    setupRenderingTest(hooks);

    test('returns the result of the passed-in function', function(assert) {
      const page = create({
        get foo() {
          return 'lorem';
        },
        get bar() {
          return 'ipsum';
        }
      });

      assert.equal(page.foo, 'lorem');
      assert.equal(page.bar, 'ipsum');
    });

    test('executes the passed-in function with the correct context for `this`', async function (assert) {
      const page = create({
        inputValue: value('input'),
        isSubmitButtonDisabled: property('disabled', 'button'),
        get isFormEmpty(): boolean {
          return !this.inputValue && this.isSubmitButtonDisabled;
        }
      });

      await render(hbs`
        <input value="">
        <button disabled="true">Submit</button>
      `);

      assert.ok(page.isFormEmpty);
    });
  });
}
