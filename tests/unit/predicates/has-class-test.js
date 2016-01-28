import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, hasClass } from '../../page-object';

moduleFor('.hasClass');

test('returns true when the element has the class', function(assert) {
  fixture('<em class="lorem"></em><span class="ipsum"></span>');

  let page = create({
    foo: hasClass('ipsum', 'span')
  });

  assert.ok(page.foo);
});

test('returns false when the element doesn\'t have the class', function(assert) {
  fixture('<em class="lorem"></em><span class="ipsum"></span>');

  let page = create({
    foo: hasClass('lorem', 'span')
  });

  assert.ok(!page.foo);
});

test("raises an error when the element doesn't exist", function(assert) {
  let page = create({
    foo: hasClass('lorem', 'span')
  });

  assert.throws(() => page.foo);
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
    foo: hasClass('ipsum', 'span', { scope: '.scope' })
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

    foo: hasClass('ipsum', 'span')
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

    foo: hasClass('lorem', 'div:first span', { resetScope: true })
  });

  assert.ok(page.foo);
});

test('finds element by index', function(assert) {
  fixture(`
    <span class="lorem"></span>
    <span class="ipsum"></span>
  `);

  let page = create({
    foo: hasClass('ipsum', 'span', { at: 1 })
  });

  assert.ok(page.foo);
});
