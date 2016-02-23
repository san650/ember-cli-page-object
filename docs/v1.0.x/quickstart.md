---
layout: page
title: Quickstart
---

Suppose we have a couple of acceptance tests to test the login page of our site.

```js
test('logs in sucessfully', function(assert) {
  visit('/login');
  fillIn('#username', 'admin');
  fillIn('#password', 'secret');
  click('button');

  andThen(function() {
    assert.equal(currentURL(), '/private-page');
  });
});

test('shows an error when password is wrong', function(assert) {
  visit('/login');
  fillIn('#username', 'admin');
  fillIn('#password', 'invalid');
  click('button');

  andThen(function() {
    assert.equal(currentURL(), '/login');
    assert.equal($.trim(find('.errors').text()), 'Invalid credentials');
  });
});
```

We want to convert these tests to use a page object.

First, we need to create a new page object. For this we'll use one of the generators that comes with the addon.

```bash
$ ember generate page-object login

installing
  create tests/pages/login.js
```

The generator created a file inside the directory `/tests/pages`. Let's describe the login page structure on our new page object.

```js
import PageObject, {
  clickable,
  fillable,
  text,
  visitable
} from 'frontend/tests/page-object';

export default PageObject.create({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors')
});
```

Now we include the page object on the test and replace the existing test helpers with the page object's methods and properties.

```js
import page from 'frontend/tests/pages/login';

// ...

test('logs in sucessfully', function(assert) {
  page
    .visit()
    .username('admin')
    .password('secret')
    .submit();

  andThen(function() {
    assert.equal(currentURL(), '/private-page');
  });
});

test('shows an error when password is wrong', function(assert) {
  page
    .visit()
    .username('admin')
    .password('invalid')
    .submit();

  andThen(function() {
    assert.equal(page.error, 'Invalid credentials');
  });
});
```

We can go a step further and describe the steps of the test using a higher level of abstraction.

```js
import PageObject, {
  clickable,
  fillable,
  text,
  visitable
} from 'frontend/tests/page-object';

export default PageObject.create({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors'),

  loginSuccessfully() {
    return this.visit()
      .username('admin')
      .password('secret')
      .submit();
  },

  loginFailed() {
    return this.visit()
      .username('admin')
      .password('invalid')
      .submit();
  }
});
```

Let's update the test accordingly.

```js
test('logs in sucessfully', function(assert) {
  page.loginSuccessfully();

  andThen(function() {
    assert.equal(currentURL(), '/private-page');
  });
});

test('shows an error when password is wrong', function(assert) {
  page.loginFailed();

  andThen(function() {
    assert.equal(page.error, 'Invalid credentials');
  });
});
```

And that's it! Our tests are cleaner, more maintainable and easier to read.
