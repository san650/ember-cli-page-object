import { moduleForProperty } from '../../../helpers/properties';
import {
  create,
  property,
  value
} from 'ember-cli-page-object';

moduleForProperty('native getter', function(test) {
  test('returns the result of the passed-in function', function(assert) {
    assert.expect(2);

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
    assert.expect(1);

    const page = create({
      inputValue: value('input'),
      isSubmitButtonDisabled: property('disabled', 'button'),
      get isFormEmpty() {
        return !this.inputValue && this.isSubmitButtonDisabled;
      }
    });

    await this.adapter.createTemplate(this, page, `
      <input value="">
      <button disabled="true">Submit</button>
    `);

    assert.ok(page.isFormEmpty);
  });
});
