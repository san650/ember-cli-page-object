import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import { isOldEmber } from 'dummy/tests/helpers/is-old-ember';

import PageObject from '../../page-object';

const {
  clickable,
  fillable,
  hasClass,
  notHasClass,
  text
} = PageObject;

const page = PageObject.create({
  form: {
    userName: fillable('#userName'),
    password: fillable('#password'),
    click: clickable('.login button'),
  },

  title: text('.title'),
  message: text('.message'),
  hasError: hasClass('is-error', '.login'),
  notHasError: notHasClass('is-error', '.login')
});

moduleForComponent('user-list', 'Integration | component integration test support/login', {
  integration: true,

  beforeEach() {
    page.setContext(this);
  },

  afterEach() {
    page.removeContext();
  }
});

test('Retries login', function(assert) {
  assert.expect(6);

  if (isOldEmber) {
    this.render(Ember.HTMLBars.compile('{{login-form}}'));
  } else {
    this.render(hbs`{{login-form}}`);
  }

  assert.ok(page.notHasError, 'Page doesn\'t have error');
  assert.equal(page.title, 'Login page');

  Ember.run(() => {
    page
      .form
      .userName('invalid')
      .password('invalid')
      .click();
  });

  assert.ok(page.hasError, 'Page has error');
  assert.equal(page.message, 'Invalid user!');

  Ember.run(() => {
    page
      .form
      .userName('user@example.com')
      .password('secret')
      .click();
  });

  assert.ok(page.notHasError, 'Page doesn\'t have error');
  assert.equal(page.message, 'Valid user!');
});

test('Action chains act like a promise', function(assert) {
  assert.expect(1);

  if (isOldEmber) {
    this.render(Ember.HTMLBars.compile('{{login-form}}'));
  } else {
    this.render(hbs`{{login-form}}`);
  }

  Ember.run(() => {
    page
      .form
      .userName('invalid')
      .password('invalid')
      .click();
  });

  assert.ok(page.hasError, 'Page has error');
});
