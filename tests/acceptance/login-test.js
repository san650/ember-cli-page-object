import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import PO from '../page-object';

var application;

module('An Integration test', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

var page = PO.build({
  visit: PO.visitable('/login'),

  form: PO.component({
    userName: PO.fillable('#userName'),
    password: PO.fillable('#password'),
    click: PO.clickable('.login button'),
  }),

  title: PO.text('.title'),
  message: PO.text('.message'),
  hasError: PO.hasClass('is-error', '.login'),
  notHasError: PO.notHasClass('is-error', '.login')
});

test('Page contents', function(assert) {
  assert.expect(6);

  page
    .visit();

  andThen(function() {
    assert.ok(page.notHasError(), 'Page doesn\'t have error');
    assert.equal(page.title(), 'Login page');
  });

  page
    .form()
    .userName('invalid')
    .password('invalid')
    .click();

  andThen(function() {
    assert.ok(page.hasError(), 'Page has error');
    assert.equal(page.message(), 'Invalid user!');
  });

  page
    .form()
    .userName('user@example.com')
    .password('secret')
    .click();

  andThen(function() {
    assert.ok(page.notHasError(), 'Page doesn\'t have error');
    assert.equal(page.message(), 'Valid user!');
  });
});
