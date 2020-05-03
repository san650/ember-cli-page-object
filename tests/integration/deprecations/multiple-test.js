import { module, test } from 'ember-qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import {
  attribute,
  contains,
  create,
  hasClass,
  isHidden,
  isPresent,
  isVisible,
  notHasClass,
  property,
  text,
  value,
} from 'ember-cli-page-object';

import require from 'require';
if (require.has('@ember/test-helpers')) {
  const { render } = require('@ember/test-helpers');

  module('Deprecation | multiple', function(hooks) {
    setupRenderingTest(hooks);

    test('attribute', async function(assert) {
      let page = create({
        foo: attribute('placeholder', ':input', { multiple: true })
      });

      await render(hbs`
        <input placeholder="a value">
        <input placeholder="other value">
      `);

      assert.deepEqual(page.foo, ['a value', 'other value']);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('value', async function(assert) {
      let page = create({
        foo: value('input', { multiple: true })
      });

      await render(hbs`
        <input value="lorem">
        <input value="ipsum">
      `);

      assert.deepEqual(page.foo, ['lorem', 'ipsum']);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('text: returns multiple values', async function(assert) {
      let page = create({
        foo: text('li', { multiple: true })
      });

      await render(hbs`
        <ul>
          <li>lorem</li>
          <li> ipsum </li>
          <li>dolor</li>
        </ul>
      `);

      assert.deepEqual(page.foo, ['lorem', 'ipsum', 'dolor']);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('property: matches multiple elements', async function(assert) {
      let page = create({
        foo: property('checked', ':input', { multiple: true })
      });

      await render(hbs`
        <input type="checkbox" checked>
        <input type="checkbox" >
      `);

      assert.deepEqual(page.foo, [true, false]);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('notHasClass: matches multiple elements with multiple: true option, returns false if some elements have class', async function(assert) {
      let page = create({
        foo: notHasClass('lorem', 'span', { multiple: true })
      });

      await render(hbs`
        <span class="lorem"></span>
        <span class="ipsum"></span>
      `);

      assert.ok(!page.foo);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('notHasClass: matches multiple elements with multiple: true option, returns true if no elements have class', async function(assert) {
      let page = create({
        foo: notHasClass('other-class', 'span', { multiple: true })
      });

      await render(hbs`
        <span class="lorem"></span>
        <span class="ipsum"></span>
      `);

      assert.ok(page.foo);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('isPresent: matches multiple elements with multiple: true option', async function(assert) {
      let page = create({
        foo: isPresent('span', { multiple: true })
      });

      await render(hbs`
        <span>lorem</span>
        <span> ipsum </span>
        <span>dolor</span>
      `);

      assert.ok(page.foo);

      assert.expectDeprecation('"multiple" property is deprecated');
    });


    test('isVisible: return false if not all elements are visible', async function(assert) {
      let page = create({
        foo: isVisible('span', { multiple: true })
      });

      await render(hbs`
        <span>lorem</span>
        <span style="display:none"> ipsum </span>
        <span>dolor</span>
      `);

      assert.ok(!page.foo);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('isVisible: does not trigger deprecation', async function(assert) {
      const page = create({
        foo: isVisible('span')
      });

      await render(hbs`
        <span>lorem</span>
      `);

      assert.equal(page.foo, true)
      assert.expectNoDeprecation();
    });


    test('isVisible: return true if all elements are visible', async function(assert) {
      let page = create({
        foo: isVisible('span', { multiple: true })
      });

      await render(hbs`
        <span>lorem</span>
        <span>dolor</span>
      `);

      assert.ok(page.foo);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('isHidden: true option, returns false if some elements are visible', async function(assert) {
      let page = create({
        foo: isHidden('em', { multiple: true })
      });

      await render(hbs`
        <em>ipsum</em>
        <em style="display:none">dolor</em>
      `);

      assert.ok(!page.foo);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('isHidden: true option, returns true if all elements are hidden', async function(assert) {
      let page = create({
        foo: isHidden('em', { multiple: true })
      });

      await render(hbs`
        <em style="display:none">ipsum</em>
        <em style="display:none">dolor</em>
      `);

      assert.ok(page.foo);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('hasClass: true option returns true if all elements have class', async function(assert) {
      let page = create({
        foo: hasClass('lorem', 'span', { multiple: true })
      });

      await render(hbs`
        <span class="lorem"></span>
        <span class="lorem"></span>
      `);

      assert.ok(page.foo);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('hasClass: true option returns false if not all elements have class', async function(assert) {
      let page = create({
        foo: hasClass('lorem', 'span', { multiple: true })
      });

      await render(hbs`
        <span class="lorem"></span>
        <span class="ipsum"></span>
      `);

      assert.ok(!page.foo);

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('contains: returns false if not all elements contain text', async function(assert) {
      let page = create({
        foo: contains('span', { multiple: true })
      });

      await render(hbs`
        <span>lorem</span>
        <span>ipsum</span>
        <span>dolor</span>
      `);

      assert.ok(!page.foo('lorem'));

      assert.expectDeprecation('"multiple" property is deprecated');
    });

    test('contains: returns true if all elements contain text', async function(assert) {
      let page = create({
        foo: contains('span', { multiple: true })
      });

      await render(hbs`
        <span>lorem</span>
        <span>lorem</span>
      `);

      assert.ok(page.foo('lorem'));

      assert.expectDeprecation('"multiple" property is deprecated');
    });
  });
}
