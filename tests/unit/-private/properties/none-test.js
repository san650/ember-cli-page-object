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

  const PAGE = create({
    activeAttrValue: attribute('data-active', 'button'),
    isButtonInactive: none('activeAttrValue')
  });

  test('treats "true" attribute value as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<button data-active="true"></button>');

    assert.notOk(PAGE.isButtonInactive);
  });

  test('treats "false" attribute value as falsy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<button data-active="false"></button>');

    assert.ok(PAGE.isButtonInactive);
  });

  test('treats any string attribute value other than "false" as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<button data-active="0"></button>');

    assert.notOk(PAGE.isButtonInactive);
  });

  test('can handle custom falsy values', function(assert) {
    assert.expect(1);

    const page = create({
      activeAttrValue: attribute('data-active', 'button', { falsy: ['no'] }),
      isButtonInactive: none('activeAttrValue')
    });

    this.adapter.createTemplate(this, page, `
      <button data-active="no"></button>
    `);

    assert.ok(page.isButtonInactive);
  });
});

moduleForProperty('none | handling `property` values', function(test) {

  const PAGE = create({
    isBoxChecked: property('checked', '[type=checkbox]'),
    isFormEmpty: none('isBoxChecked'),

    autoCompleteProp: property('autocomplete', 'input'),
    isAutocompleteOff: none('autoCompleteProp')
  });

  test('treats true property value as truthy', function(assert) {
    assert.expect(2);

    this.adapter.createTemplate(this, PAGE, '<input type="checkbox" checked>');

    assert.equal(PAGE.isBoxChecked, true);
    assert.notOk(PAGE.isFormEmpty);
  });

  test('treats false property value as falsy', function(assert) {
    assert.expect(2);

    this.adapter.createTemplate(this, PAGE, '<input type="checkbox">');

    assert.equal(PAGE.isBoxChecked, false);
    assert.ok(PAGE.isFormEmpty);
  });

  test('treats non-empty string property value as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<input type="text" autocomplete="foo">');

    assert.notOk(PAGE.isAutocompleteOff);
  });

  test('treats empty string property value as falsy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<input type="text" autocomplete="">');

    assert.ok(PAGE.isAutocompleteOff);
  });

  test('treats undefined property value as falsy', function(assert) {
    assert.expect(2);

    const page = create({
      fooProp: property('data-foo', '[type=checkbox]'),
      isCheckboxWithoutFoo: none('fooProp')
    });

    this.adapter.createTemplate(this, page, '<input type="checkbox">');

    assert.equal(page.fooProperty, undefined);
    assert.ok(page.isCheckboxWithoutFoo);
  });

  test('can handle custom falsy values', function (assert) {
    assert.expect(1);

    const page = create({
      inputAutocompleteProp: property('autocomplete', 'input', { falsy: ['off'] }),
      isAutocompleteOff: none('inputAutocompleteProp')
    });

    this.adapter.createTemplate(this, page, `
      <input type="text" autocomplete="off">
    `);

    assert.ok(page.isAutocompleteOff);
  });
});

moduleForProperty('none | handling `text` values', function(test) {

  const PAGE = create({
    spanText: text('span'),
    isSpanEmpty: none('spanText')
  });

  test('treats non-empty text value as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<span>Foo</span>');

    assert.notOk(PAGE.isSpanEmpty);
  });

  test('treats "false" text value as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<span>false</span>');

    assert.notOk(PAGE.isSpanEmpty);
  });

  test('treats empty string text value as falsy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<span></span>');

    assert.ok(PAGE.isSpanEmpty);
  });

  test('treats white space text value as falsy by default', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<span>  </span>');

    assert.ok(PAGE.isSpanEmpty);
  });

  test('treats white space text value as truthy with { normalize: false } option', function(assert) {
    assert.expect(1);

    const page = create({
      spanText: text('span', { normalize: false }),
      isSpanEmpty: none('spanText')
    });

    this.adapter.createTemplate(this, page, '<span>  </span>');

    assert.notOk(page.isSpanEmpty);
  });

  test('can handle custom falsy values', function(assert) {
    assert.expect(1);

    const page = create({
      spanText: text('span', { falsy: '---' }),
      isSpanEmpty: none('spanText')
    });

    this.adapter.createTemplate(this, page, '<span>---</span>');

    assert.ok(page.isSpanEmpty);
  });
});

moduleForProperty('none | handling `value` values', function(test) {

  const PAGE = create({
    inputValue: value('input'),
    isInputEmpty: none('inputValue')
  });

  test('treats non-empty string value as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<input type="text">');
    $('input').val('Lorem');

    assert.notOk(PAGE.isInputEmpty);
  });

  test('treats "false" value as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<input type="text">');
    $('input').val('false');

    assert.notOk(PAGE.isInputEmpty);
  });

  test('treats white space value as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<input type="text">');
    $('input').val('  ');

    assert.notOk(PAGE.isInputEmpty);
  });

  test('treats empty string value as falsy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<input type="text">');
    $('input').val('');

    assert.ok(PAGE.isInputEmpty);
  });

  test('can handle custom falsy values', function(assert) {
    assert.expect(1);

    const page = create({
      inputValue: value('input', { falsy: ['---'] }),
      isInputEmpty: none('inputValue')
    });

    this.adapter.createTemplate(this, page, '<input type="text">');
    $('input').val('---');

    assert.ok(page.isInputEmpty);
  });
});

moduleForProperty('none | handling `count` values', function(test) {

  const PAGE = create({
    buttonCount: count('button'),
    areButtonsAbsent: none('buttonCount')
  });

  test('treates count value > 0 as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<button></button>');

    assert.notOk(PAGE.areButtonsAbsent);
  });

  test('treates count value === 0 as falsy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<div></div>');

    assert.ok(PAGE.areButtonsAbsent);
  });
});

moduleForProperty('none | handling `collection` values', function(test) {

  const PAGE = create({
    spans: collection({
      itemScope: 'span'
    }),
    hasNoSpans: none('spans')
  });

  test('treats empty collection as falsy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<div>Lorem ipsum</div>');

    assert.ok(PAGE.hasNoSpans);
  });

  test('treats non-empty collection as truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, '<span>Lorem ipsum</span>');

    assert.notOk(PAGE.hasNoSpans);
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
      isBarNone: none('bar')
    });

    assert.ok(page.isFooNone);
    assert.ok(page.isBarNone);
  });

  test('handles a function that returns an array', function(assert) {
    assert.expect(3);

    const page = create({
      foo() {
        return [];
      },
      isFooNone: none('foo'),

      bar() {
        return ['lorem', false];
      },
      isBarNone: none('bar'),

      baz() {
        return [null, undefined, 0, false, ''];
      },
      isBazNone: none('baz')
    });

    assert.ok(page.isFooNone);
    assert.notOk(page.isBarNone);
    assert.ok(page.isBazNone);
  });

  test('handles a function that returns an object', function(assert) {
    assert.expect(2);

    const page = create({
      foo() {
        return {};
      },
      isFooNone: none('foo'),

      bar() {
        return { hello: 'world' };
      },
      isBarNone: none('bar')
    });

    assert.notOk(page.isFooNone);
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

moduleForProperty('none | checking falsiness of multiple properties', function(test) {

  const PAGE = create({
    isSubmitButtonVisible: isVisible('.submit-button'),
    labelText: text('label'),
    areInstructionsShown: {
      isDescriptor: true,
      get() {
        return this.labelText === 'I am the instructions';
      }
    },
    isFormInSubmittedState: none('isSubmitButtonVisible', 'areInstructionsShown')
  });

  test('returns false if all property values are falsy', function(assert) {
    assert.expect(3);

    this.adapter.createTemplate(this, PAGE, `
      <label>I am not the instructions</label>
      <button class="submit-button" hidden></button>
    `);

    assert.equal(PAGE.areInstructionsShown, false);
    assert.equal(PAGE.isSubmitButtonVisible, false);
    assert.ok(PAGE.isFormInSubmittedState);
  });

  test('returns true if any property value is truthy', function(assert) {
    assert.expect(3);

    this.adapter.createTemplate(this, PAGE, `
      <label>I am not the instructions</label>
      <button class="submit-button"></button>
    `);

    assert.equal(PAGE.areInstructionsShown, false);
    assert.equal(PAGE.isSubmitButtonVisible, true);
    assert.notOk(PAGE.isFormInSubmittedState);
  });
});

moduleForProperty('none | handling properties with { multiple: true }', function(test) {

  const PAGE = create({
    activeSpanAttrValue: attribute('data-active', 'span', { multiple: true }),
    spanText: text('span', { multiple: true }),
    areSpansInactive: none('activeSpanAttrValue', 'spanText')
  });

  test('returns true if any value is truthy', function(assert) {
    assert.expect(3);

    this.adapter.createTemplate(this, PAGE, `
      <span>Lorem</span>
      <span data-active=""></span>
      <span data-active="false"></span>
    `);

    assert.deepEqual(PAGE.activeSpanAttrValue, [undefined, '', 'false']);
    assert.deepEqual(PAGE.spanText, ['Lorem', '', '']);
    assert.notOk(PAGE.areSpansInactive);
  });

  test('returns false if all values are falsy', function(assert) {
    assert.expect(3);

    this.adapter.createTemplate(this, PAGE, `
      <span></span>
      <span data-active=""></span>
      <span data-active="false"></span>
    `);

    assert.deepEqual(PAGE.activeSpanAttrValue, [undefined, '', 'false']);
    assert.deepEqual(PAGE.spanText, ['', '', '']);
    assert.ok(PAGE.areSpansInactive);
  });
});

moduleForProperty('none | handling nested properties', function(test) {

  const PAGE = create({
    body: {
      span: {
        scope: 'span',
        activeAttrValue: attribute('data-active')
      },
    },
    controls: {
      checkbox: {
        scope: '[type="checkbox"]',
        isChecked: is(':checked')
      },
    },

    isPageInactive: none('body.span.activeAttrValue', 'controls.checkbox.isChecked')
  });

  test('returns true if any value is truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, `
      <input type="checkbox" checked>
      <span data-active="false"></span>
    `);

    assert.notOk(PAGE.isPageInactive);
  });

  test('returns false if all values are falsy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, `
      <input type="checkbox">
      <span data-active="false"></span>
    `);

    assert.ok(PAGE.isPageInactive);
  });
});

moduleForProperty('none | handling aliased properties', function(test) {

  const PAGE = create({
    body: {
      span: {
        scope: 'span',
        activeAttrValue: attribute('data-active')
      },
    },
    controls: {
      checkbox: {
        scope: '[type="checkbox"]',
        isChecked: is(':checked')
      },
      isCheckboxChecked: alias('checkbox.isChecked')
    },

    isSpanActive: alias('body.span.activeAttrValue'),
    isChecked: alias('controls.isCheckboxChecked'),

    isPageInactive: none('isSpanActive', 'isChecked')
  });

  test('returns true if any value is truthy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, `
      <input type="checkbox" checked>
      <span data-active="false"></span>
    `);

    assert.notOk(PAGE.isPageInactive);
  });

  test('returns false if all values are falsy', function(assert) {
    assert.expect(1);

    this.adapter.createTemplate(this, PAGE, `
      <input type="checkbox">
      <span data-active="false"></span>
    `);

    assert.ok(PAGE.isPageInactive);
  });
});
