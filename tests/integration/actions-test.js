import { run } from '@ember/runloop';
import $ from '-jquery';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  createCalculatorTemplate,
  createInputsTemplate
} from './test-helper';
import expectEmberError from '../expect-ember-error';
import { alias } from 'ember-cli-page-object/macros';

import {
  create,
  collection,
  attribute,
  clickOnText,
  clickable,
  contains,
  fillable,
  hasClass,
  notHasClass,
  text,
  value,
  count,
  isHidden,
  isPresent,
  isVisible
} from 'ember-cli-page-object';

import require from 'require';
if (require.has('@ember/test-helpers')) {
  const { render } = require('@ember/test-helpers');

  const button = function(scope) {
    return {
      scope,

      click: clickable(),
      text: text()
    };
  };

  const page = create({
    numbers: collection('.numbers button', {
      click: clickable(),
      text: text()
    }),

    clickOnNumber: clickOnText('.numbers'),

    operators: {
      scope: '.operators',

      plus: button('button:nth-of-type(1)'),
      minus: button('button:nth-of-type(2)'),
      equals: button('button:nth-of-type(3)')
    },

    screen: {
      text: text('.screen')
    },

    clickOn: clickOnText('', { scope: '.calculator' }),

    calculator: {
      scope: '.calculator',

      clickOn: clickOnText()
    },

    clickOnAlias: alias('clickOn', { chainable: true }),
    clickPlusAlias: alias('operators.plus.click', { chainable: true }),
    clickEqualsAlias: alias('operators.equals.click', { chainable: true }),

    nonExistant: {
      scope: '#non-existant',

      // should throw an error
      attribute: attribute('an-attribute'),
      clickOnText: clickOnText(),
      clickable: clickable(),
      contains: contains(),
      fillable: fillable(),
      hasClass: hasClass('foo'),
      notHasClass: notHasClass('bar'),
      text: text(),
      value: value(),

      // should not throw an error
      count: count(),
      isHidden: isHidden(),
      isPresent: isPresent(),
      isVisible: isVisible()
    }
  });

  module('Integration | actions', function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
      page.setContext(this);
    });

    hooks.afterEach(function() {
      page.removeContext();
    });

    test('Actions work when defined inside collections', async function(assert) {
      let template = createCalculatorTemplate();

      await render(template);

      await page
        .numbers
        .objectAt(0)
        .click();

      assert.equal(page.screen.text, '1');
    });

    test('Chaining of custom actions works', async function(assert) {
      let template = createCalculatorTemplate();

      await render(template);

      await page
        .clickOnNumber('1')
        .clickOnNumber('2')
        .clickOnNumber('3');

      assert.equal(page.screen.text, '123');
    });

    test('Chaining of actions on the root works', async function(assert) {
      let template = createCalculatorTemplate();

      await render(template)

      await page
        .clickOn('1')
        .clickOn('+')
        .clickOn('4')
        .clickOn('-')
        .clickOn('2')
        .operators
        .equals
        .click();

      assert.equal(page.screen.text, '3');
    });

    test('Chaining of actions on a component works', async function(assert) {
      let template = createCalculatorTemplate();

      await render(template)

      await page
        .calculator
        .clickOn('1')
        .clickOn('+')
        .clickOn('5')
        .clickOn('-')
        .clickOn('4')
        .clickOn('=');

      assert.equal(page.screen.text, '2');
    });

    test('Chaining of aliased root actions works', async function(assert) {
      let template = createCalculatorTemplate();

      await render(template)

      await page
        .clickOnAlias('1')
        .clickOnAlias('4');

      assert.equal(page.screen.text, '14');
    });

    test('Chaining of aliased component actions works', async function(assert) {
      let template = createCalculatorTemplate();

      await render(template)

      await page
        .clickOn('1')
        .clickPlusAlias()
        .clickOn('4')
        .clickEqualsAlias();

      assert.equal(page.screen.text, '5');
    });

    test('fill in by attribute', async function(assert) {
      let template = createInputsTemplate();

      await render(template);

      await page
        .fillIn('input1', 'input 1')
        .fillIn('input2', 'input 2')
        .fillIn('input3', 'input 3')
        .fillIn('input4', 'input 4')
        .fillIn('input5', 'input 5');

      assert.dom('.input1-value').hasValue('input 1');
      assert.dom('.input2-value').hasValue('input 2');
      assert.dom('.input3-value').hasValue('input 3');
      assert.dom('.input4-value').hasValue('input 4');
      assert.dom('.input5-value').hasValue('input 5');

      await page
        .fillIn('textarea1', 'textarea 1')
        .fillIn('textarea2', 'textarea 2')
        .fillIn('textarea3', 'textarea 3')
        .fillIn('textarea4', 'textarea 4')
        .fillIn('textarea5', 'textarea 5');

      assert.dom('.textarea1-value').hasValue('textarea 1');
      assert.dom('.textarea2-value').hasValue('textarea 2');
      assert.dom('.textarea3-value').hasValue('textarea 3');
      assert.dom('.textarea4-value').hasValue('textarea 4');
      assert.dom('.textarea5-value').hasValue('textarea 5');

      await page
        .fillIn('contenteditable1', 'contenteditable 1')
        .fillIn('contenteditable2', 'contenteditable 2')
        .fillIn('contenteditable3', 'contenteditable 3')
        .fillIn('contenteditable4', 'contenteditable 4')
        .fillIn('contenteditable5', 'contenteditable 5');

      assert.dom('.contenteditable1-content').hasText('contenteditable 1');
      assert.dom('.contenteditable2-content').hasText('contenteditable 2');
      assert.dom('.contenteditable3-content').hasText('contenteditable 3');
      assert.dom('.contenteditable4-content').hasText('contenteditable 4');
      assert.dom('.contenteditable5-content').hasText('contenteditable 5');

      await page
        .fillIn('select1', 'select 1 option 2')
        .fillIn('select2', 'select 2 option 2')
        .fillIn('select3', 'select 3 option 2')
        .fillIn('select4', 'select 4 option 2')
        .fillIn('select5', 'select 5 option 2');

      assert.dom('.select1-value').hasValue('select 1 option 2');
      assert.dom('.select2-value').hasValue('select 2 option 2');
      assert.dom('.select3-value').hasValue('select 3 option 2');
      assert.dom('.select4-value').hasValue('select 4 option 2');
      assert.dom('.select5-value').hasValue('select 5 option 2');
    });

    test('Queries and actions handle non-existant elements correctly', async function(assert) {
      assert.expect(13);

      let message = /Element not found./;
      let template = createCalculatorTemplate();

      await render(template);

      run(() => {
        assert.throws(() => page.nonExistant.attribute(), message, 'attribute query did not throw an error');
      });
      run(() => {
        expectEmberError(assert, () => page.nonExistant.clickOnText('qux'), message, 'clickOnText action did not throw an error');
      });
      run(() => {
        expectEmberError(assert, () => page.nonExistant.clickable(), message, 'clickable action did not throw an error');
      });
      run(() => {
        assert.throws(() => page.nonExistant.contains('something'), message, 'contains action did not throw an error');
      });
      run(() => {
        expectEmberError(assert, () => page.nonExistant.fillable('baz'), message, 'fillable action did not throw an error');
      });
      run(() => {
        assert.throws(() => page.nonExistant.hasClass, message, 'hasClass query did not throw an error');
      });
      run(() => {
        assert.throws(() => page.nonExistant.notHasClass, message, 'notHasClass query did not throw an error');
      });
      run(() => {
        assert.throws(() => page.nonExistant.text, message, 'text query did not throw an error');
      });
      run(() => {
        assert.throws(() => page.nonExistant.value, message, 'value query did not throw an error');
      });

      assert.equal(page.nonExistant.count, 0);
      assert.equal(page.nonExistant.isHidden, true);
      assert.equal(page.nonExistant.isVisible, false);
      assert.equal(page.nonExistant.isPresent, false);
    });
  });

  module('Integration | actions', function(hooks) {
    setupRenderingTest(hooks);

    hooks.afterEach(function() {
      $('#alternate-ember-testing').html('');
    });

    test('looks for elements outside the testing container', async function(assert) {
      assert.expect(0);

      $('#alternate-ember-testing').html('<button>lorem</button><input>');

      let page = create({
        context: this,
        clickOnText: clickOnText('button', { testContainer: '#alternate-ember-testing' }),
        clickable: clickable('button', { testContainer: '#alternate-ember-testing' }),
        fillable: fillable('input', { testContainer: '#alternate-ember-testing' })
      });

      await page
        .clickOnText('lorem')
        .clickable()
        .fillable('foo');
    });

    test('looks for elements within test container specified at node level', async function(assert) {
      assert.expect(0);

      $('#alternate-ember-testing').html('<button>lorem</button><input>');

      let page = create({
        context: this,
        testContainer: '#alternate-ember-testing',
        clickOnText: clickOnText('button'),
        clickable: clickable('button'),
        fillable: fillable('input')
      });

      await page
        .clickOnText('lorem')
        .clickable()
        .fillable('foo');
    });
  });

}
