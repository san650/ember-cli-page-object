import { moduleForProperty } from '../../../helpers/properties';
import {
  create,
  property,
  value
} from 'ember-cli-page-object';
import { descriptor } from 'ember-cli-page-object/macros';

moduleForProperty('descriptor', function(test) {
  test('returns the result of the passed-in function', function(assert) {
    assert.expect(2);

    const page = create({
      foo: descriptor(function() {
        return 'lorem';
      }),
      bar: descriptor(function() {
        return 'ipsum';
      })
    });

    assert.equal(page.foo, 'lorem');
    assert.equal(page.bar, 'ipsum');
  });

  test('executes the passed-in function with the descriptor\'s context for `this`', function (assert) {
    assert.expect(1);

    const page = create({
      inputValue: value('input'),
      isSubmitButtonDisabled: property('disabled', 'button'),
      isFormEmpty: descriptor(function() {
        return !this.inputValue && this.isSubmitButtonDisabled;
      })
    });

    this.adapter.createTemplate(this, page, `
      <input value="">
      <button disabled="true">Submit</button>
    `);

    assert.ok(page.isFormEmpty);
  });

  test('calls the passed-in function with the page object property key', function(assert) {
    assert.expect(2);

    const page = create({
      foo: descriptor(function(key) {
        assert.equal(key, 'foo');
        return true;
      })
    });

    assert.ok(page.foo);
  });

  test('throws an error if a function is not passed in', function(assert) {
    assert.expect(1);

    const page = create({
      foo: descriptor('not a function')
    });

    assert.throws(
      () => page.foo,
      /must be a function/,
      'Argument passed to descriptor must be a function'
    );
  });
});
