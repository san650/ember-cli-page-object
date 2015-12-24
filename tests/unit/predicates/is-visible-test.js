import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, isVisible } from '../../page-object';

moduleFor('.isVisible');

test('returns true when the element is visible', function(assert) {
  fixture('<div class="element" />');

  let page = create({
    elementIsVisible: isVisible('.element')
  });

  assert.ok(page.elementIsVisible);
});

test('returns false when the element is hidden', function(assert) {
  fixture('<div class="element" style="display:none" />');

  let page = create({
    elementIsVisible: isVisible('.element')
  });

  assert.ok(!page.elementIsVisible);
});

test('throws an error when the element doesn\'t exist in the DOM', function(assert) {
  let page = create({
    elementIsVisible: isVisible('.element')
  });

  assert.throws(() => page.elementIsVisible);
});

test('uses scope', function(assert) {
  fixture('<div class="element" style="display:none" /><div class="scope"><div class="element" /></div>');

  let page = create({
    firstElementIsVisible: isVisible('.element:first', { scope: '.scope' })
  });

  assert.ok(page.firstElementIsVisible);
});

test('uses parent scope', function(assert) {
  fixture('<div class="element" style="display:none" /><div class="scope"><div class="element" /></div>');

  let page = create({
    scope: '.scope',

    firstElementIsVisible: isVisible('.element:first')
  });

  assert.ok(page.firstElementIsVisible);
});
