import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import { create, findElement, findElementWithAssert, visitable } from 'ember-cli-page-object';

moduleForAcceptance('Acceptance | extends');

let page = create({
  visit: visitable('/calculator'),

  findElement(selector) {
    return findElement(this, selector);
  },

  findElementWithAssert(selector) {
    return findElementWithAssert(this, selector);
  }
});

test('finds an element in the DOM', function(assert) {
  page.visit();

  andThen(function() {
    let element = page.findElement('.screen');
    assert.ok(element.length);

    element = page.findElementWithAssert('.screen');
    assert.ok(element.length);
  });
});
