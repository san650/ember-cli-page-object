import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, isHidden } from '../../page-object';

moduleFor('.isHidden');

test('returns true when the element is hidden', function(assert) {
  fixture('<div class="element" style="display:none" />');

  let page = create({
    elementIsHidden: isHidden('.element')
  });

  assert.ok(page.elementIsHidden);
});

test('returns true when the element doesn\'t exist in the DOM', function(assert) {
  let page = create({
    elementIsHidden: isHidden('.element')
  });

  assert.ok(page.elementIsHidden);
});

test('returns false when the element is visible', function(assert) {
  fixture('<div class="element" />');

  let page = create({
    elementIsHidden: isHidden('.element')
  });

  assert.ok(!page.elementIsHidden);
});

test('uses scope', function(assert) {
  fixture('<div class="element" /><div class="scope"><div class="element" style="display:none" /></div>');

  let page = create({
    firstElementIsHidden: isHidden('.element:first', { scope: '.scope' })
  });

  assert.ok(page.firstElementIsHidden);
});

test('uses parent scope', function(assert) {
  fixture('<div class="element" /><div class="scope"><div class="element" style="display:none" /></div>');

  let page = create({
    scope: '.scope',

    firstElementIsHidden: isHidden('.element:first')
  });

  assert.ok(page.firstElementIsHidden);
});
