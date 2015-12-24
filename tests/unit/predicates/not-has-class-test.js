import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, notHasClass } from '../../page-object';

moduleFor('.notHasClass');

test('returns false when the element has the class', function(assert) {
  fixture('<div class="element has-error" />');

  let page = create({
    elementDoesNotHaveError: notHasClass('has-error', '.element')
  });

  assert.ok(!page.elementDoesNotHaveError);
});

test('returns true when the element doesn\'t have the class', function(assert) {
  fixture('<div class="element" />');

  let page = create({
    elementDoesNotHaveError: notHasClass('has-error', '.element')
  });

  assert.ok(page.elementDoesNotHaveError);
});

test('raises an error when the element doesn\'t exist', function(assert) {
  let page = create({
    elementDoesNotHaveError: notHasClass('has-error', '.element')
  });

  assert.throws(() => page.elementDoesNotHaveError);
});

test('uses scope', function(assert) {
  fixture('<div class="element scope has-error"><div class="element" /></div>');

  let page = create({
    firstElementDoesNotHaveError: notHasClass('has-error', '.element:first', { scope: '.scope' })
  });

  assert.ok(page.firstElementDoesNotHaveError);
});

test('uses parent scope', function(assert) {
  fixture('<div class="element scope has-error"><div class="element" /></div>');

  let page = create({
    scope: '.scope',

    firstElementDoesNotHaveError: notHasClass('has-error', '.element:first')
  });

  assert.ok(page.firstElementDoesNotHaveError);
});
