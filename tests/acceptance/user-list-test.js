import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import PageObject from '../page-object';

var application;

module('Collections', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

var isDisabled = PageObject.customHelper(function(selector) {
  return $(selector).prop('disabled');
});

var selectBox = PageObject.customHelper(function() {
  return {
    select: PageObject.selectable(),
    selected: PageObject.text(`option:selected`),
    isDisabled: isDisabled()
  };
});

var isAdmin = PageObject.customHelper(function(selector) {
  return function() {
    return $(selector).hasClass('admin');
  };
});

var page = PageObject.create({
  visit: PageObject.visitable('/users'),

  title: PageObject.text('h1'),

  users: PageObject.collection({
    itemScope: 'tbody tr',
    item: {
      userName: PageObject.text('td', { index: 1 }),
      role: PageObject.text('td', { index: 2 }),
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
