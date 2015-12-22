import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, contains } from '../../page-object';

moduleFor('.contains');

test('returns true when the element contains the text', function(assert) {
  fixture('<div class="element"> Test something </div>');

  let page = create({
    elementHas: contains('.element')
  });

  assert.ok(page.elementHas('Test'));
});

test('returns false when the element does not contains the text', function(assert) {
  fixture('<div class="element"> Test something </div>');

  let page = create({
    elementHas: contains('.element')
  });

  assert.ok(!page.elementHas('Not here'));
});

test('uses scope', function(assert) {
  fixture(`<div class="element">Wrong</div>
           <div class="scope">
             <div class="element"> Right </div>
           </div>`);

  let page = create({
    firstElementHas: contains('.element:first', { scope: '.scope' })
  });

  assert.ok(page.firstElementHas('Right'));
});

test('uses parent scope', function(assert) {
  fixture(`<div class="element">Wrong</div>
           <div class="scope">
             <div class="element">Right</div>
           </div>`);

  let page = create({
    scope: '.scope',

    firstElementHas: contains('.element:first')
  });

  assert.ok(page.firstElementHas('Right'));
});

test('raises an error when the element doesn\'t exist', function(assert) {

  let page = create({
    firstElementHas: contains('.element')
  });

  assert.throws(function(){
    page.elementHas('Bla');
  });
});

