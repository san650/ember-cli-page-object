import { moduleForProperty } from '../../../helpers/properties';
import {
  create,
  property,
  value
} from 'ember-cli-page-object';
import { getter } from 'ember-cli-page-object/macros';

moduleForProperty('getter', function(test) {
  test('returns the result of the passed-in function', function(assert) {
    assert.expect(2);

    const page = create({
      foo: getter(function() {
        return 'lorem';
      }),
      bar: getter(function() {
        return 'ipsum';
      })
    });

    assert.equal(page.foo, 'lorem');
    assert.equal(page.bar, 'ipsum');
  });

  test('executes the passed-in function with the correct context for `this`', async function (assert) {
    assert.expect(1);

    const page = create({
      inputValue: value('input'),
      isSubmitButtonDisabled: property('disabled', 'button'),
      isFormEmpty: getter(function() {
        return !this.inputValue && this.isSubmitButtonDisabled;
      })
    });

    await this.adapter.createTemplate(this, page, `
      <input value="">
      <button disabled="true">Submit</button>
    `);

    assert.ok(page.isFormEmpty);
  });

  test('calls the passed-in function with the property key', function(assert) {
    assert.expect(2);

    const page = create({
      foo: getter(function(key) {
        assert.equal(key, 'foo');
        return true;
      })
    });

    assert.ok(page.foo);
  });

  test('throws an error if a function is not passed in', function(assert) {
    assert.expect(1);

    const page = create({
      foo: getter('not a function')
    });

    assert.throws(
      () => page.foo,
      /must be a function/,
      'Argument passed to getter must be a function'
    );
  });
});
