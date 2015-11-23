import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import textList from '../../page-object/properties/text-list';

moduleFor('Queries', 'textList');

test('returns the inner text of the element', function(assert) {
  const itemsText = ['this', 'is', 'a', 'cat'];
  const listItems = itemsText.map((item) => { return `<li>${item}</li>`; }).join();
  fixture(`<ul>${listItems}</ul>`);

  const property = buildProperty(textList('ul li'));

  assert.deepEqual(property.invoke(), itemsText);
});

test('returns the inner text of the element', function(assert) {
  const itemsText = ['  this  ', 'really&nbspis', 'a\n', 'cat'];
  const listItems = itemsText.map((item) => { return `<li>${item}</li>`; }).join();
  fixture(`<ul>${listItems}</ul>`);

  const property = buildProperty(textList('ul li'));

  assert.deepEqual(property.invoke(), ['this', 'really is', 'a', 'cat']);
});

test('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  const property = buildProperty(textList('ul li'));

  try {
    property.invoke();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

test('returns empty when the element doesn\'t have text', function(assert) {
  fixture('<ul><li></li></ul>');

  const property = buildProperty(textList('ul li'));

  assert.equal(property.invoke(), '');
});

test('uses scope', function(assert) {
  const itemsText = ['this', 'is', 'a', 'cat'];
  const listItems = itemsText.map((item) => { return `<li>${item}</li>`; }).join();
  const outsideScopeList = `<ul><li>hello</li></ul>`;
  fixture(`${outsideScopeList}<div class="scope"><ul>${listItems}</ul></div>`);

  const property = buildProperty(textList('ul li'), { scope: '.scope' });

  assert.deepEqual(property.invoke(), itemsText);
});
