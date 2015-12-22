import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, hasClass } from '../../page-object';

moduleFor('.hasClass');

test('returns true when the element has the class', function(assert) {
  fixture('<div class="element has-error" />');

  let page = create({
    elementHasError: hasClass('has-error', '.element')
  });

  assert.ok(page.elementHasError);
});

test('returns false when the element doesn\'t have the class', function(assert) {
  fixture('<div class="element" />');

  let page = create({
    elementHasError: hasClass('has-error', '.element')
  });

  assert.ok(!page.elementHasError);
});

test('raises an error when the element doesn\'t exist', function(assert) {
  let page = create({
    elementHasError: hasClass('has-error', '.element')
  });

  assert.throws(function() {
    page.elementHasError;
  });
});

test('uses scope', function(assert) {
  fixture('<div class="element scope"><div class="element has-error" /></div>');

  let page = create({
    firstElementHasError: hasClass('has-error', '.element:first', { scope: '.scope' })
  });

  assert.ok(page.firstElementHasError);
});

test('uses parent scope', function(assert) {
  fixture('<div class="element scope"><div class="element has-error" /></div>');

  let page = create({
    scope: '.scope',

    firstElementHasError: hasClass('has-error', '.element:first')
  });

  assert.ok(page.firstElementHasError);
});
