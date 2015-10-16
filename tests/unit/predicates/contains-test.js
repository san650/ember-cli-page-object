import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import contains from '../../page-object/properties/contains';

moduleFor('propertys', 'contains');

test('returns true when the element contains the text', function(assert) {
  fixture('<div class="element"> Test something </div>');

  var property = buildProperty(contains('.element'));

  assert.ok(property.invoke('Test'));
});

test('returns false when the element does not contains the text', function(assert) {
  fixture('<div class="element"> Test something </div>');

  var property = buildProperty(contains('.element'));

  assert.ok(!property.invoke('Not here'));
});

test('uses scope', function(assert) {
  fixture(`<div class="element">Wrong</div>
           <div class="scope">
             <div class="element"> Right </div>
           </div>`);

  var property = buildProperty(contains('.element:first', { scope: '.scope' }));

  assert.ok(property.invoke('Right'));
});

test('uses parent scope', function(assert) {
  fixture(`<div class="element">Wrong</div>
           <div class="scope">
             <div class="element">Right</div>
           </div>`);

  var property = buildProperty(contains('.element:first'), { scope: '.scope' });

  assert.ok(property.invoke('Right'));
});

test('raises an error when the element doesn\'t exist', function(assert) {
  let property = buildProperty(contains('span'));

  assert.throws(function(){
    property.invoke("Boom");
  });
});

