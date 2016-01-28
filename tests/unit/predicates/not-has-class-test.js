import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, notHasClass } from '../../page-object';

moduleFor('.notHasClass');

test('returns false when the element has the class', function(assert) {
  fixture('<span class="lorem ipsum"></span>');

  let page = create({
    foo: notHasClass('ipsum', '.lorem')
  });

  assert.ok(!page.foo);
});

test('returns true when the element doesn\'t have the class', function(assert) {
  fixture('<span class="lorem"></span>');

  let page = create({
    foo: notHasClass('ipsum', '.lorem')
  });

  assert.ok(page.foo);
});

test('raises an error when the element doesn\'t exist', function(assert) {
  let page = create({
    elementDoesNotHaveError: notHasClass('has-error', '.element')
  });

  assert.throws(() => page.elementDoesNotHaveError);
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div>
      <span class="lorem"></span>
    </div>
    <div class="scope">
      <span class="ipsum"></span>
    </div>
  `);

  let page = create({
    foo: notHasClass('lorem', 'span', { scope: '.scope' })
  });

  assert.ok(page.foo);
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div>
      <span class="lorem"></span>
    </div>
    <div class="scope">
      <span class="ipsum"></span>
    </div>
  `);

  let page = create({
    scope: '.scope',

    foo: notHasClass('lorem', 'span')
  });

  assert.ok(page.foo);
});

test('resets scope', function(assert) {
  fixture(`
    <div>
      <span class="lorem"></span>
    </div>
    <div class="scope">
      <span class="ipsum"></span>
    </div>
  `);

  let page = create({
    scope: '.scope',

    foo: notHasClass('ipsum', 'span', { resetScope: true, at: 0 })
  });

  assert.ok(page.foo);
});

test('finds element by index', function(assert) {
  fixture(`
    <span class="lorem"></span>
    <span class="ipsum"></span>
  `);

  let page = create({
    foo: notHasClass('lorem', 'span', { at: 1 })
  });

  assert.ok(page.foo);
});
