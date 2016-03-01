import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import { isOldEmber } from 'dummy/tests/helpers/is-old-ember';

import PageObject from 'dummy/tests/page-object';

const {
  attribute,
  selectable,
  text,
  collection,
  isVisible,
  hasClass
} = PageObject;

// FIXME: this doesn't work. It's a prop, not an attr.
// function isDisabled(selector) {
//   return attribute('disabled', selector);
// }

// FIXME: This used to be a `customHelper`. Make sure this still
// works and is bound to the single item in which it is called.
function selectBox(selector) {
  return {
    select: selectable(selector),
    selected: text(`option:selected`),
    //isDisabled: isDisabled(selector)
    disabled: attribute('disabled', selector)
  };
}

// FIXME: This used to be a `customHelper`. Make sure this still
// works and is bound to the single item in which it is called.
function isAdmin(selector) {
  return hasClass('admin', selector);
}

const page = PageObject.create({
  title: text('h1'),

  users: collection({
    itemScope: 'tbody tr',

    item: {
      userName: text('td', { at: 0 }),
      role: text('td', { at: 1 }),
      animalPreference: selectBox('select'),
      isAdmin: isAdmin(),
      isVisible: isVisible()
    }
  })
});

moduleForComponent('user-list', 'Integration | component integration test support/user list', {
  integration: true,

  beforeEach() {
    page.setContext(this);
  },

  afterEach() {
    page.removeContext();
  }
});

test('Component contents', function(assert) {
  assert.expect(13);

  let template;

  if (isOldEmber) {
    template = Ember.HTMLBars.compile('{{user-list users=users}}');
  } else {
    template = hbs`{{user-list users=users}}`;
  }

  this.set('users', Ember.A([
    { userName: 'jane', role: 'admin', disabledAnimalPreference: false, admin: true },
    { userName: 'jolanta', role: 'guest', disabledAnimalPreference: false, admin: false },
    { userName: 'john', role: 'guest', disabledAnimalPreference: true, admin: false }
  ]));

  page.render(template);

  assert.equal(page.title, 'Users');
  assert.equal(page.users().count, 3);
  assert.ok(page.users(0).isVisible);
  assert.equal(page.users(0).userName, 'jane');
  assert.equal(page.users(0).role, 'admin');
  assert.ok(page.users(0).isAdmin, 'is not admin');
  assert.equal(page.users(0).animalPreference.selected, 'Cats');
  assert.notOk(page.users(1).isAdmin, 'is admin');
  assert.equal(page.users(1).animalPreference.selected, 'Cats');
  // FIXME: Change this back to the prop version when it works
  // assert.equal(page.users(1).animalPreference.isDisabled, true);
  assert.notEqual(page.users(1).animalPreference.disabled, 'disabled');
  assert.equal(page.users(2).animalPreference.disabled, 'disabled');

  page.users(0)
    .animalPreference
    .select('Tomsters');

  assert.equal(page.users(0).animalPreference.selected, 'Tomsters');
  assert.equal(page.users(1).animalPreference.selected, 'Cats');
});
