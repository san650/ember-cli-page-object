import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import PageObject from '../../page-object';

const {
  customHelper,
  selectable,
  text,
  collection
} = PageObject;

moduleForComponent('user-list', 'Integration | component integration test support/user list', {
  integration: true
});

const isDisabled = customHelper(function(selector) {
  return $(selector).prop('disabled');
});

const selectBox = customHelper(function() {
  return {
    select: selectable(),
    selected: text(`option:selected`),
    isDisabled: isDisabled()
  };
});

const isAdmin = customHelper(function(selector) {
  return function() {
    return $(selector).hasClass('admin');
  };
});

test('Component contents', function(assert) {
  assert.expect(8);

  const page = PageObject.create({
    context: this,

    title: text('h1'),

    users: collection({
      itemScope: 'tbody tr',
      item: {
        userName: text('td', { index: 1 }),
        role: text('td', { index: 2 }),
        animalPreference: selectBox('select'),
        isAdmin: isAdmin()
      }
    })
  });

  this.set('users', [
    { userName: 'jane', role: 'admin', disabledAnimalPreference: false, admin: true },
    { userName: 'john', role: 'guest', disabledAnimalPreference: true, admin: false }
  ]);

  this.render(hbs`{{user-list users=users}}`);

  page.users(1).animalPreference().select('Tomsters');

  assert.equal(page.title(), 'Users');
  assert.equal(page.users().count(), 2);
  assert.ok(page.users(1).isVisible());
  assert.equal(page.users(1).userName(), 'jane');
  assert.equal(page.users(1).role(), 'admin');
  assert.equal(page.users(1).animalPreference().selected(), 'Tomsters');
  assert.ok(page.users(1).isAdmin(), 'is not admin');
  assert.equal(page.users(2).animalPreference().isDisabled(), true);
});
