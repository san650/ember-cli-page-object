import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import PageObject from '../../page-object';

moduleForComponent('user-list', 'Integration | component integration test support/login', {
  integration: true
});

const {
  clickable,
  fillable,
  hasClass,
  notHasClass,
  text
} = PageObject;

const Page = PageObject.extend({
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

test('Retries login', function(assert) {
  assert.expect(6);

  const page = Page.create({context: this});

  this.render(hbs`{{login-form}}`);

  assert.ok(page.notHasError(), 'Page doesn\'t have error');
  assert.equal(page.title(), 'Login page');

  page
    .form()
    .userName('invalid')
    .password('invalid')
    .click();

  assert.ok(page.hasError(), 'Page has error');
  assert.equal(page.message(), 'Invalid user!');

  page
    .form()
    .userName('user@example.com')
    .password('secret')
    .click();

  assert.ok(page.notHasError(), 'Page doesn\'t have error');
  assert.equal(page.message(), 'Valid user!');
});

test('Action chains act like a promise', function(assert) {
  assert.expect(1);

  const page = Page.create({context: this});

  this.render(hbs`{{login-form}}`);

  page
    .form()
    .userName('invalid')
    .password('invalid')
    .click();

  assert.ok(page.hasError(), 'Page has error');
});
