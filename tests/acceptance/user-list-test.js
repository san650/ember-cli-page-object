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

var page = PO.build({
  visit: PO.visitable('/users'),

  title: PO.text('h1'),

  users: PO.collection({
    itemScope: 'tbody tr',
    item: {
      userName: PO.text('td', { index: 1 }),
      role: PO.text('td', { index: 2}),
      selectGender: PO.selectable('select'),
      gender: PO.text('select option:selected')
    }
  })
});

test('Page contents', function(assert) {
  assert.expect(5);

  page.visit();

  page.users(1).selectGender('Female');

  andThen(function() {
    assert.equal(page.title(), 'Users');
    assert.equal(page.users().count(), 2);
    assert.equal(page.users(1).userName(), 'jane');
    assert.equal(page.users(1).role(), 'admin');
    assert.equal(page.users(1).gender(), 'Female');
  });
});
