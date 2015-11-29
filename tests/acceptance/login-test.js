import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import PageObject from '../page-object';

moduleForAcceptance('Acceptance | login');

var {
  clickable,
  fillable,
  hasClass,
  notHasClass,
  text,
  visitable
} = PageObject;

var page = PageObject.create({
  visit: visitable('/login'),

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

test('Action chains act like a promise', function(assert) {
  assert.expect(1);

  page
    .visit()
    .form()
    .userName('invalid')
    .password('invalid')
    .click().then(function() {
      assert.ok(page.hasError(), 'Page has error');
    });
});
