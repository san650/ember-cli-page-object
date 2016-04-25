 import { test } from 'qunit';
 import moduleForAcceptance from '../helpers/module-for-acceptance';
 import PageObject from '../page-object';

 moduleForAcceptance('Acceptance | default properties');

 var {
   visitable,
   hasClass
 } = PageObject;

 test('Adds default properties', function(assert) {
   var page = PageObject.create({
     visit: visitable('/calculator'),

     one: {
       scope: '.numbers button:nth-of-type(1)'
     },

     screen: {
       scope: '.screen',

       expression: {
         scope: 'input',

         isFocused: hasClass('focused')
       },

       result: {
         scope: '.result'
       }
     }
   });

   page
    .visit()
    .screen.expression.focus();

  andThen(function() {
    assert.ok(page.screen.expression.isFocused);
  });

   page
     .clickOn('9')
     .one
     .click();

   page.clickOn('=');

   andThen(function() {
     assert.equal(page.screen.result.text, '91', 'text');
     assert.ok(page.screen.result.contains('91'), 'contains');
     assert.ok(!page.screen.result.contains('99'), 'not contains');
     assert.ok(page.screen.isVisible, 'isVisible');
     assert.ok(!page.screen.isHidden, 'isHidden');
   });
 });

 test('Overrides default properties', function(assert) {
   var page = PageObject.create({
     dummy: {
       isHidden() {
         return 'isHidden';
       },
       isVisible() {
         return 'isVisible';
       },
       clickOn() {
         return 'clickOn';
       },
       click() {
         return 'click';
       },
       contains() {
         return 'contains';
       },
       text() {
         return 'text';
       }
     }
   });

   andThen(function() {
     assert.equal(page.dummy.isHidden(), 'isHidden');
     assert.equal(page.dummy.isVisible(), 'isVisible');
     assert.equal(page.dummy.clickOn(), 'clickOn');
     assert.equal(page.dummy.click(), 'click');
     assert.equal(page.dummy.contains(), 'contains');
     assert.equal(page.dummy.text(), 'text');
   });
 });
