import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import PO from 'page-object';

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
      userName: PO.text('td:nth-of-type(1)'),
      role: PO.text('td:nth-of-type(2)')
    }
  })
});

test('Page contents', function(assert) {
  assert.expect(3);

  page.visit();

  andThen(function() {
    assert.equal(page.title(), 'Users');
    assert.equal(page.users(1).userName(), 'jane');
    assert.equal(page.users(1).role(), 'admin');
  });
});
