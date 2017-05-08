import { moduleForProperty } from '../../../helpers/properties';
import {
  attribute,
  create,
  collection,
  count,
  hasClass,
  is,
  isHidden,
  isVisible,
  notHasClass,
  property,
  text,
  value
} from 'ember-cli-page-object';
import { alias, none } from 'ember-cli-page-object/macros';

moduleForProperty('none | handling `attribute` values', function(test) {

  test('treats "true" attribute value as truthy', function(assert) {
    assert.expect(1);

    const page = create({
      activeAttributeValue: attribute('data-active', 'button'),
      isButtonInactive: none('activeAttributeValue')
    });

    this.adapter.createTemplate(this, page, '<button data-active="true"></button>');

    assert.notOk(page.isButtonInactive);
  });

  test('treats any string attribute value other than "false" as truthy', function(assert) {
    assert.expect(1);

    const page = create({
      activeAttributeValue: attribute('data-active', 'button'),
      isButtonInactive: none('activeAttributeValue')
    });

    this.adapter.createTemplate(this, page, '<button data-active="0"></button>');

    assert.notOk(page.isButtonInactive);
  });

  test('treats "false" attribute value as falsy', function(assert) {
    assert.expect(1);

    const page = create({
      activeAttributeValue: attribute('data-active', 'button'),
      isButtonInactive: none('activeAttributeValue')
    });

    this.adapter.createTemplate(this, page, '<button data-active="false"></button>');

    assert.ok(page.isButtonInactive);
  });

  test('can handle custom falsy values', function(assert) {
    assert.expect(6);

    const page = create({
      button1ActiveAttribute: attribute('data-active', '.button-1', {
        falsyValues: ['no']
      }),
      isButton1Inactive: none('button1ActiveAttribute'),

      button2ActiveAttribute: attribute('data-active', '.button-2', {
        falsyValues: ['0']
      }),
      isButton2Inactive: none('button2ActiveAttribute'),

      button3ActiveAttribute: attribute('data-active', '.button-3'),
      isButton3Inactive: none('button2ActiveAttribute'),
    });

    this.adapter.createTemplate(this, page, `
      <button class="button-1" data-active="no"></button>
      <button class="button-2" data-active="0"></button>
      <button class="button-3" data-active="false"></button>
    `);

    assert.equal(page.button1ActiveAttribute, 'no');
    assert.ok(page.isButton1Inactive);

    assert.equal(page.button2ActiveAttribute, '0');
    assert.ok(page.isButton2Inactive);

    assert.equal(page.button3ActiveAttribute, 'false');
    assert.ok(page.isButton3Inactive);
  });
});

moduleForProperty('none | handling `property` values', function(test) {

  test('treats true property value as truthy', function(assert) {
    assert.expect(2);

    const page = create({
      isBoxChecked: property('checked', '[type=checkbox]'),
      isFormEmpty: none('isBoxChecked')
    });

    this.adapter.createTemplate(this, page, '<input type="checkbox" checked=true>');

    assert.equal(page.isBoxChecked, true);
    assert.notOk(page.isFormEmpty);
  });

  test('treats false property value as falsy', function(assert) {
    assert.expect(2);

    const page = create({
      isBoxChecked: property('checked', '[type=checkbox]'),
      isFormEmpty: none('isBoxChecked')
    });

    this.adapter.createTemplate(this, page, '<input type="checkbox">');

    assert.equal(page.isBoxChecked, false);
    assert.ok(page.isFormEmpty);
  });

  test('treats empty string property value as falsy', function(assert) {
    assert.expect(2);

    const page = create({
      autoCompleteProp: property('autocomplete', 'input'),
      inputAutoCompletes: none('autoCompleteProp')
    });

    this.adapter.createTemplate(this, page, '<input type="text">');

    assert.equal(page.autoCompleteProp, '');
    assert.ok(page.inputAutoCompletes);
  });

  test('treats undefined property value as falsy', function(assert) {
    assert.expect(2);

    const page = create({
      fooProperty: property('foo-made-up-property', '[type=checkbox]'),
      isFormEmpty: none('fooProperty')
    });

    this.adapter.createTemplate(this, page, '<input type="checkbox">');

    assert.equal(page.fooProperty, undefined);
    assert.ok(page.isFormEmpty);
  });

  test('can handle custom falsy property values', function (assert) {
    assert.expect(6);

    const page = create({
      input1AutocompleteProp: property('autocomplete', '.input-1', {
        falsyValues: ['off']
      }),
      input1DoesNotAutocomplete: none('input1AutocompleteProp'),

      input2AutocompleteProp: property('autocomplete', '.input-2', {
        falsyValues: ['off']
      }),
      input2DoesNotAutocomplete: none('input2AutocompleteProp'),

      input3AutocompleteProp: property('autocomplete', '.input-3', {
        falsyValues: ['off']
      }),
      input3DoesNotAutoComplete: none('input3AutocompleteProp')
    });

    this.adapter.createTemplate(this, page, `
      <input class="input-1" type="text">
      <input class="input-2" type="text" autocomplete="off">
      <input class="input-3" type="text" autocomplete="email">
    `);

    assert.equal(page.input1AutocompleteProp, '');
    assert.ok(page.input1DoesNotAutocomplete);

    assert.equal(page.input2AutocompleteProp, 'off');
    assert.ok(page.input2DoesNotAutocomplete);

    assert.equal(page.input3AutocompleteProp, 'email');
    assert.notOk(page.input3DoesNotAutoComplete);
  });
});

moduleForProperty('none | handling `text` values', function(test) {

  test('treats non-empty text value as truthy', function(assert) {
    assert.expect(1);

    const page = create({
      buttonText: text('button'),
      isButtonInactive: none('buttonText')
    });

    this.adapter.createTemplate(this, page, '<button>Foo</button>');

    assert.notOk(page.isButtonInactive);
  });

  test('treats "false" text value as truthy', function(assert) {
    assert.expect(1);

    const page = create({
      buttonText: text('button'),
      isButtonInactive: none('buttonText')
    });

    this.adapter.createTemplate(this, page, '<button>false</button>');

    assert.notOk(page.isButtonInactive);
  });

  test('treats white space text value as falsy by default', function(assert) {
    assert.expect(1);

    const page = create({
      buttonText: text('button'),
      isButtonInactive: none('buttonText')
    });

    this.adapter.createTemplate(this, page, '<button>  </button>');
    assert.ok(page.isButtonInactive);
  });

  test('treats white space text value as truthy if { normalize: false } is passed into options', function(assert) {
    assert.expect(1);

    const page = create({
      buttonText: text('button', { normalize: false }),
      isButtonInactive: none('buttonText')
    });

    this.adapter.createTemplate(this, page, '<button>  </button>');
    assert.notOk(page.isButtonInactive);
  });

  test('treats empty string text value as falsy', function(assert) {
    assert.expect(1);

    const page = create({
      buttonText: text('button'),
      isButtonInactive: none('buttonText')
    });

    this.adapter.createTemplate(this, page, '<button></button>');

    assert.ok(page.isButtonInactive);
  });

  test('can handle custom falsy values', function(assert) {
    assert.expect(1);

    const page = create({
      buttonText: text('button', { falsyValues: ['---'] }),
      isButtonInactive: none('buttonText')
    });

    this.adapter.createTemplate(this, page, '<button>---</button>');

    assert.ok(page.isButtonInactive);
  });
});

moduleForProperty('none | handling `value` values', function(test) {

  test('treats non-empty string value as truthy', function(assert) {
    assert.expect(1);

    const page = create({
      inputValue: value('input'),
      isInputEmpty: none('inputValue')
    });

    this.adapter.createTemplate(this, page, '<input type="text">');
    $('input').val('Lorem');

    assert.notOk(page.isInputEmpty);
  });

  test('treats "false" value as truthy', function(assert) {
    assert.expect(1);

    const page = create({
      inputValue: value('input'),
      isInputEmpty: none('inputValue')
    });

    this.adapter.createTemplate(this, page, '<input type="text">');
    $('input').val('false');

    assert.notOk(page.isInputEmpty);
  });

  test('treats white space value as truthy', function(assert) {
    assert.expect(1);

    const page = create({
      inputValue: value('input'),
      isInputEmpty: none('inputValue')
    });

    this.adapter.createTemplate(this, page, '<input type="text">');
    $('input').val('  ');

    assert.notOk(page.isInputEmpty);
  });

  test('treats empty string value as falsy', function(assert) {
    assert.expect(1);

    const page = create({
      inputValue: value('input'),
      isInputEmpty: none('inputValue')
    });

    this.adapter.createTemplate(this, page, '<input type="text">');
    $('input').val('');

    assert.ok(page.isInputEmpty);
  });

  test('can handle custom falsy values', function(assert) {
    assert.expect(1);

    const page = create({
      inputValue: value('input', { falsyValues: ['---'] }),
      isInputEmpty: none('inputValue')
    });

    this.adapter.createTemplate(this, page, '<input type="text">');
    $('input').val('---');

    assert.ok(page.isInputEmpty);
  });
});

moduleForProperty('none | handling `count` values', function(test) {

  test('treates count value > 0 as truthy', function(assert) {
    assert.expect(1);

    const page = create({
      buttonCount: count('button'),
      areButtonsAbsent: none('buttonCount')
    });

    this.adapter.createTemplate(this, page, '<button></button>');

    assert.notOk(page.areButtonsAbsent);
  });

  test('treates count value === 0 as falsy', function(assert) {
    assert.expect(1);

    const page = create({
      buttonCount: count('button'),
      areButtonsAbsent: none('buttonCount')
    });

    this.adapter.createTemplate(this, page, '<div></div>');

    assert.ok(page.areButtonsAbsent);
  });
});

moduleForProperty('none | handling `collection` values', function(test) {

  test('treats empty collection as falsy', function(assert) {
    assert.expect(1);

    const page = create({
      foo: collection({
        itemScope: 'span'
      }),
      isFooNone: none('foo')
    });

    this.adapter.createTemplate(this, page, '<div>Lorem ipsum</div>');

    assert.ok(page.isFooNone);
  });

  test('treats non-empty collection as truthy', function(assert) {
    assert.expect(1);

    const page = create({
      foo: collection({
        itemScope: 'div'
      }),
      isFooNone: none('foo')
    });

    this.adapter.createTemplate(this, page, '<div>Lorem ipsum</div>');

    assert.notOk(page.isFooNone);
  });
});

moduleForProperty('none | handling properties that return booleans', function(test) {
  test('handles `isVisible` values', function(assert) {
    assert.expect(2);

    const page = create({
      isButton1Visible: isVisible('.button-1'),
      isButton1Hidden: none('isButton1Visible'),

      isButton2Visible: isVisible('.button-2'),
      isButton2Hidden: none('isButton2Visible')
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <button class="button-1" hidden>Submit</button>
        <button class="button-2">Submit</button>
      </div>
    `);

    assert.ok(page.isButton1Hidden);
    assert.notOk(page.isButton2Hidden);
  });

  test('handles `isHidden` values', function(assert) {
    assert.expect(2);

    const page = create({
      isButton1Hidden: isHidden('.button-1'),
      isButton1Visible: none('isButton1Hidden'),

      isButton2Hidden: isHidden('.button-2'),
      isButton2Visible: none('isButton2Hidden')
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <button class="button-1">Submit</button>
        <button class="button-2" hidden>Submit</button>
      </div>
    `);

    assert.ok(page.isButton1Visible);
    assert.notOk(page.isButton2Visible);
  });

  test('handles `hasClass` values', function(assert) {
    assert.expect(2);

    const page = create({
      isButton1Active: hasClass('is-active', '.button-1'),
      isButton1Inactive: none('isButton1Active'),

      isButton2Active: hasClass('is-active', '.button-2'),
      isButton2Inactive: none('isButton2Active')
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <button class="button-1">Submit</button>
        <button class="button-2 is-active">Submit</button>
      </div>
    `);

    assert.ok(page.isButton1Inactive);
    assert.notOk(page.isButton2Inactive);
  });

  test('handles `notHasClass` values', function(assert) {
    assert.expect(2);

    const page = create({
      isButton1Inactive: notHasClass('is-active', '.button-1'),
      isButton1Active: none('isButton1Inactive'),

      isButton2Inactive: notHasClass('is-active', '.button-2'),
      isButton2Active: none('isButton2Inactive')
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <button class="button-1 is-active">Submit</button>
        <button class="button-2">Submit</button>
      </div>
    `);

    assert.ok(page.isButton1Active);
    assert.notOk(page.isButton2Active);
  });

  test('handles `is` values', function(assert) {
    assert.expect(2);

    const page = create({
      isButton1Disabled: is(':disabled', '.button-1'),
      isButton1Enabled: none('isButton1Disabled'),

      isButton2Disabled: is(':disabled', '.button-2'),
      isButton2Enabled: none('isButton2Disabled')
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <button class="button-1">Submit</button>
        <button class="button-2" disabled>Submit</button>
      </div>
    `);

    assert.ok(page.isButton1Enabled);
    assert.notOk(page.isButton2Enabled);
  });
});

moduleForProperty('none | handling function return values', function(test) {

  test('handles a function that returns a number', function(assert) {
    assert.expect(2);

    const page = create({
      foo() {
        return 0;
      },
      isFooNone: none('foo'),

      bar() {
        return 1;
      },
      isBarNone: none('bar')
    });

    assert.ok(page.isFooNone);
    assert.notOk(page.isBarNone);
  });

  test('handles a function that returns a string', function(assert) {
    assert.expect(2);

    const page = create({
      foo() {
        return '';
      },
      isFooNone: none('foo'),

      bar() {
        return 'lorem';
      },
      isBarNone: none('bar')
    });

    assert.ok(page.isFooNone);
    assert.notOk(page.isBarNone);
  });

  test('handles a function that returns a boolean', function(assert) {
    assert.expect(2);

    const page = create({
      foo() {
        return false;
      },
      isFooNone: none('foo'),

      bar() {
        return true;
      },
      isBarNone: none('bar')
    });

    assert.ok(page.isFooNone);
    assert.notOk(page.isBarNone);
  });

  test('handles a function that returns null or undefined', function(assert) {
    assert.expect(2);

    const page = create({
      foo() {
        return undefined;
      },
      isFooNone: none('foo'),

      bar() {
        return null;
      },
      isBartNone: none('bar'),
    });

    assert.ok(page.isFooNone);
    assert.notOk(page.isBarNone);
  });

  test('handles a function that returns an array', function(assert) {
    assert.expect(2);

    const page = create({
      foo() {
        return [];
      },
      isFooNone: none('foo'),

      bar() {
        return ['lorem'];
      },
      isBartNone: none('bar'),
    });

    assert.ok(page.isFooNone);
    assert.notOk(page.isBarNone);
  });

  test('handles a function that returns a reference to a collection', function(assert) {
    assert.expect(2);

    const page = create({
      spans: collection({
        itemScope: 'span'
      }),
      foo() {
        return this.spans;
      },
      isFooNone: none('foo'),

      divs: collection({
        itemScope: 'div'
      }),
      bar() {
        return this.divs;
      },
      isBarNone: none('bar')
    });

    this.adapter.createTemplate(this, page, '<div>Lorem ipsum</div>');

    assert.ok(page.isFooNone);
    assert.notOk(page.isBarNone);
  });

  test('handles a function that returns the enumerable for a collection', function(assert) {
    assert.expect(2);

    const page = create({
      spans: collection({
        itemScope: 'span'
      }),
      foo() {
        return this.spans();
      },
      isFooNone: none('foo'),

      divs: collection({
        itemScope: 'div'
      }),
      bar() {
        return this.divs();
      },
      isBarNone: none('bar')
    });

    this.adapter.createTemplate(this, page, '<div>Lorem ipsum</div>');

    assert.ok(page.isFooNone);
    assert.notOk(page.isBarNone);
  });
});

moduleForProperty('none | handling multiple properties', function(test) {
  test('returns false if all property values are falsy', function(assert) {
    assert.expect(3);

    const page = create({
      isSubmitButtonVisible: isVisible('.submit-button'),
      instructionsText: text('label'),
      areInstructionsShown: {
        isDescriptor: true,
        get() {
          return this.instructionsText === 'Submit your info';
        }
      },
      isFormDisabled: none('isSubmitButtonVisible', 'areInstructionsShown')
    });

    this.adapter.createTemplate(this, page, `
      <label>Nothing to do here</label>
      <button class="submit-button" hidden></button>
    `);

    assert.equal(page.areInstructionsShown, false);
    assert.equal(page.isSubmitButtonVisible, false);
    assert.ok(page.isFormDisabled);
  });

  test('returns true if any property value is truthy', function(assert) {
    assert.expect(3);

    const page = create({
      isSubmitButtonVisible: isVisible('.submit-button'),
      instructionsText: text('label'),
      areInstructionsShown: {
        isDescriptor: true,
        get() {
          return this.instructionsText === 'Submit your info';
        }
      },
      isFormDisabled: none('areInstructionsShown', 'isSubmitButtonVisible')
    });

    this.adapter.createTemplate(this, page, `
      <label>Nothing to do here</label>
      <button class="submit-button"></button>
    `);

    assert.equal(page.areInstructionsShown, false);
    assert.equal(page.isSubmitButtonVisible, true);
    assert.notOk(page.isFormDisabled);
  });
});

moduleForProperty('none | handling properties with { multiple: true }', function(test) {

  test('returns true if any value is truthy', function(assert) {
    assert.expect(4);

    const page = create({
      activeSpanAttrValue: attribute('data-active', 'span', { multiple: true }),
      spanText: text('span', { multiple: true }),
      areBoxesChecked: is(':checked', '[type="checkbox"]', { multiple: true }),
      isPageInactive: none('activeSpanAttrValue', 'spanText', 'areBoxesChecked')
    });

    this.adapter.createTemplate(this, page, `
      <input type="checkbox">
      <input type="checkbox" checked>
      <span>Lorem</span>
      <span data-active=""></span>
      <span data-active="false"></span>
      <span data-active=""></span>
    `);

    assert.deepEqual(page.activeSpanAttrValue, [undefined, '', 'false', '']);
    assert.deepEqual(page.spanText, ['Lorem', '', '', '']);
    assert.equal(page.areBoxesChecked, false);
    assert.notOk(page.isPageInactive);
  });

  test('returns false if all values are falsy', function(assert) {
    assert.expect(1);

    const page = create({
      activeSpanAttrValue: attribute('data-active', 'span', { multiple: true }),
      spanText: text('span', { multiple: true }),
      areBoxesChecked: is(':checked', '[type="checkbox"]', { multiple: true }),
      isPageInactive: none('activeSpanAttrValue', 'spanText', 'areBoxesChecked')
    });

    this.adapter.createTemplate(this, page, `
      <input type="checkbox">
      <input type="checkbox">
      <span></span>
      <span data-active=""></span>
      <span data-active="false"></span>
    `);

    assert.ok(page.isPageInactive);
  });
});

moduleForProperty('none | handling aliased properties', function(test) {
  test('returns true if any value is truthy', function(assert) {
    assert.expect(1);

    const page = create({
      span: {
        scope: 'span',
        activeAttrValue: attribute('data-active')
      },
      checkbox: {
        scope: '[type="checkbox"]',
        isChecked: is(':checked')
      },

      isSpanActive: alias('span.activeAttrValue'),
      isChecked: alias('checkbox.isChecked'),

      isPageInactive: none('isSpanActive', 'isChecked')
    });

    this.adapter.createTemplate(this, page, `
      <input type="checkbox" checked>
      <span data-active="false"></span>
    `);

    assert.notOk(page.isPageInactive);
  });

  test('returns false if all values are falsy', function(assert) {
    assert.expect(1);

    const page = create({
      span: {
        scope: 'span',
        activeAttrValue: attribute('data-active')
      },
      checkbox: {
        scope: '[type="checkbox"]',
        isChecked: is(':checked')
      },

      isSpanActive: alias('span.activeAttrValue'),
      isChecked: alias('checkbox.isChecked'),

      isPageInactive: none('isSpanActive', 'isChecked')
    });

    this.adapter.createTemplate(this, page, `
      <input type="checkbox">
      <span data-active="false"></span>
    `);

    assert.ok(page.isPageInactive);
  });
});
