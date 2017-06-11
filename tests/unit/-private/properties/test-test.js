import { moduleForProperty } from '../../../helpers/properties';
import {
  create,
  property,
  text,
  value
} from 'ember-cli-page-object';
import { test as testMacro } from 'ember-cli-page-object/macros';

moduleForProperty('test', function(test) {
  test('can test a top-level property', function(assert) {
    assert.expect(2);

    const page = create({
      inputAutocomplete: property('autocomplete', 'input'),
      isAutocompleteDisabled: testMacro('inputAutocomplete', function(val) {
        return val === 'off';
      }),
      isAutocompleteEnabled: testMacro('inputAutocomplete', function(val) {
        return val === 'on';
      })
    });

    this.adapter.createTemplate(this, page, '<input autocomplete="on">');

    assert.notOk(page.isAutocompleteDisabled);
    assert.ok(page.isAutocompleteEnabled);
  });

  test('can test a nested property', function(assert) {
    assert.expect(2);

    const page = create({
      form: {
        inputAutocomplete: property('autocomplete', 'input'),
      },
      isAutocompleteDisabled: testMacro('form.inputAutocomplete', function(val) {
        return val === 'off';
      }),
      isAutocompleteEnabled: testMacro('form.inputAutocomplete', function(val) {
        return val === 'on';
      })
    });

    this.adapter.createTemplate(this, page, '<input autocomplete="on">');

    assert.notOk(page.isAutocompleteDisabled);
    assert.ok(page.isAutocompleteEnabled);
  });

  test('executes the callback function with the descriptor\'s context for `this`', function (assert) {
    assert.expect(1);

    const page = create({
      nameInputValue: value('input'),
      greetingText: text('.greeting'),
      greetingTextIncludesName: testMacro('greetingText', function(val) {
        return val === 'Hello, ' + this.nameInputValue;
      })
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <span>Enter Your Name Here:</span>
        <input type="text" value="Ember">
      </div>
      <div class="greeting">Hello, Ember</div>
    `);

    assert.ok(page.greetingTextIncludesName);
  });

  test('can handle an arrow callback function that does not reference properties of `this`', function (assert) {
    assert.expect(2);

    const page = create({
      inputAutocomplete: property('autocomplete', 'input'),
      isAutocompleteDisabled: testMacro('inputAutocomplete', val => val === 'off'),
      isAutocompleteEnabled: testMacro('inputAutocomplete', val => val === 'on')
    });

    this.adapter.createTemplate(this, page, '<input autocomplete="on">');

    assert.notOk(page.isAutocompleteDisabled);
    assert.ok(page.isAutocompleteEnabled);
  });

  test('throws error if `test` targets a nonexistent property', function(assert) {
    assert.expect(1);

    const page = create({
      isAutocompleteEnabled: testMacro('inputAutocomplete', function(val) {
        return val === 'on';
      })
    });

    assert.throws(
      () => page.isAutocompleteEnabled,
      /does not contain property `inputAutocomplete`/,
      'Target property not found'
    );
  });

  test('throws error if a callback function is not passed in', function(assert) {
    assert.expect(1);

    const page = create({
      inputAutocomplete: property('autocomplete', 'input'),
      isAutocompleteEnabled: testMacro('inputAutocomplete')
    });

    assert.throws(
      () => page.isAutocompleteEnabled,
      /expects a function/,
      'Callback must be passed into `test` macro'
    );
  });
});
