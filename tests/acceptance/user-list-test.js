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

var selectBox = PO.customHelper(function(selector, options) {
  return {
    select: PO.selectable(),
    selected: PO.text(`option:selected`),
    isDisabled: isDisabled()
  };
});

var isDisabled = PO.customHelper(function(selector, options) {
  return $(selector).prop('disabled');
});

var isAdmin = PO.customHelper(function(selector, options) {
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
  assert.expect(7);

  page.visit();

  page.users(1).gender().select('Female');

  andThen(function() {
    assert.equal(page.title(), 'Users');
    assert.equal(page.users().count(), 2);
    assert.equal(page.users(1).userName(), 'jane');
    assert.equal(page.users(1).role(), 'admin');
    assert.equal(page.users(1).gender().selected(), 'Female');
    assert.ok(page.users(1).isAdmin(), 'is not admin');
    assert.equal(page.users(2).gender().isDisabled(), true);
  });
});
