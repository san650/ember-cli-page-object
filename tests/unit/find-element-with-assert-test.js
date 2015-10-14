import { test } from 'qunit';
import { moduleFor, fixture } from './test-helper';
import { findElementWithAssert } from '../page-object/helpers';
import { create } from '../page-object/create';
import text from '../page-object/properties/text';

moduleFor('Base', 'findElementWithAssert');

function assertMessage(assert, error, message, prop, finder) {
  var msg = error.toString();

  assert.ok(msg.indexOf(message) > -1, 'Includes error message');
  assert.ok(msg.indexOf(prop) > -1, 'Includes property definition');
  assert.ok(msg.indexOf(finder) > -1, 'Includes finder');
}

test('finds element', function(assert) {
  let expected = fixture('<div class="scope"></div>').get(0);

  let actual = findElementWithAssert({ selector: '.scope'}, {}).get(0);

  assert.equal(actual, expected, 'returns the element');
});

test('raise an error', function(assert) {
  assert.throws(() =>
    findElementWithAssert({ selector: '.scope'}, {}),
    'Throws an error'
  );
});

test('shows simple error validation', function(assert) {
  assert.expect(3);

  let page = create({
    key: text('.a-selector')
  });

  try {
    page.key();
  } catch(error) {
    assertMessage(
      assert,
      error,
      'Element not found',
      'key: text(".a-selector")',
      '=> find(".a-selector")'
    );
  }
});

test('includes scope', function(assert) {
  assert.expect(3);

  let page = create({
    scope: '.a-scope',
    key: text('.a-selector', { scope: '.b-scope' })
  });

  try {
    page.key();
  } catch(error) {
    assertMessage(
      assert,
      error,
      'Element not found',
      'key: text(".a-selector", { scope: ".b-scope" })',
      '=> find(".b-scope .a-selector")'
    );
  }
});

test('includes component scope', function(assert) {
  assert.expect(3);

  let page = create({
    scope: '.a-scope',
    key: text('.a-selector')
  });

  try {
    page.key();
  } catch(error) {
    assertMessage(
      assert,
      error,
      'Element not found',
      'key: text(".a-selector")',
      '=> find(".a-scope .a-selector")'
    );
  }
});
