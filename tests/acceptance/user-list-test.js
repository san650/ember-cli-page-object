import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import PO from '../page-object';

var application;

module('Collections', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

var selectBox = PO.customHelper(function() {
  return PO.component('select');
});

var isAdmin = PO.customHelper(function(selector) {
  return function() {
    return $(selector).hasClass('admin');
  };
});

var page = PO.build({
  visit: PO.visitable('/users'),

  title: PO.text('h1'),

  users: PO.collection({
    itemScope: 'tbody tr',
    item: {
      userName: PO.text('td', { index: 1 }),
      role: PO.text('td', { index: 2 }),
      gender: selectBox('select'),
      isAdmin: isAdmin()
    }
  })
});

test('Page contents', function(assert) {
  assert.expect(8);

  page.visit();

  page.users(1).gender().select('Female');

  andThen(function() {
    assert.equal(page.title(), 'Users');
    assert.equal(page.users().count(), 2);
    assert.ok(page.users(1).isVisible());
    assert.equal(page.users(1).userName(), 'jane');
    assert.equal(page.users(1).role(), 'admin');
    assert.equal(page.users(1).gender().selected(), 'Female');
    assert.ok(page.users(1).isAdmin(), 'is not admin');
    assert.equal(page.users(2).gender().isDisabled(), true);
  });
});
