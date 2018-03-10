---
layout: page
title: Quickstart
---

{% raw %}
This is a short guide to get you started writing page objects and using them in your acceptance and integration tests.

- [Acceptance tests](#acceptance-tests)
- [Integration tests](#integration-tests)

## Acceptance Tests

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
import {
  create,
  clickable,
  fillable,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors')
});
```

Now we include the page object in the test and replace the existing test helpers with the page object's methods and properties.

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
import {
  create,
  clickable,
  fillable,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors'),

  loginSuccessfully() {
    return this.username('admin')
      .password('secret')
      .submit();
  },

  loginFailed() {
    return this.username('admin')
      .password('invalid')
      .submit();
  }
});
```

Let's update the test accordingly.

```js
test('logs in sucessfully', function(assert) {
  page.visit()
    .loginSuccessfully();

  andThen(function() {
    assert.equal(currentURL(), '/private-page');
  });
});

test('shows an error when password is wrong', function(assert) {
  page.visit()
    .loginFailed();

  andThen(function() {
    assert.equal(page.error, 'Invalid credentials');
  });
});
```

## Integration Tests

We've made a page object for our login page. Now let's use the same page object to write integration tests for our login form component.

Here are our integration tests before using a page object.

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('login-form', 'Integration | login form', {
  integration: true
});

test('calls submit action with correct username and password', function(assert) {
  assert.expect(2);

  function submit(username, password) {
    assert.equal(username, 'admin');
    assert.equal(password, 'secret');
  }

  this.set('submit', submit);

  this.render(hbs`
    {{login-form
      submit=(action submit)
    }}
  `);

  $username = this.$('#username');
  $password = this.$('#password');

  $username.val('admin');
  $username.trigger('input');
  $username.change();

  $password.val('secret');
  $password.trigger('input');
  $password.change();

  this.$('button').click();
});

test('shows errors', function(assert) {
  assert.expect(2);

  this.set('errors', []);

  this.render(hbs`
    {{login-form
      errors=errors
    }}
  `);

  assert.equal(this.$('.errors').trim().text()), '');

  Ember.run(() => {
    this.set('errors', ['Invalid credentials']);
  });

  assert.equal(this.$('.errors').trim().text()), 'Invalid credentials');
});
```

Let's use our existing page object to refactor these integration tests. As a reminder, here is our page object. (We don't need to change anything to use it in our integration tests!)

```js
import {
  create,
  clickable,
  fillable,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors'),

  loginSuccessfully() {
    return this.username('admin')
      .password('secret')
      .submit();
  },

  loginFailed() {
    return this.username('admin')
      .password('invalid')
      .submit();
  }
});
```

Let's set up our test to use the page object we created.

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import page from 'frontend/tests/pages/login';

moduleForComponent('login-form', 'Integration | login form', {
  integration: true,

  beforeEach() {
    page.setContext(this);
  },

  afterEach() {
    page.removeContext();
  }
});

test('calls submit action with correct username and password', function(assert) {
  assert.expect(2);

  function submit(username, password) {
    assert.equal(username, 'admin');
    assert.equal(password, 'secret');
  }

  this.set('submit', submit);

  this.render(hbs`{{login-form
    submit=(action submit)
  }}`);

  page
    .username('admin')
    .password('secret')
    .submit();
});

test('shows errors', function(assert) {
  assert.expect(2);

  this.set('error', '');

  this.render(hbs`
    {{login-form
      error=error
    }}
  `);

  assert.equal(page.error, '');

  Ember.run(() => {
    this.set('error', 'Invalid credentials');
  });

  assert.equal(page.error, 'Invalid credentials');
});
```

Let's take a look at the changes:

- In the test's `beforeEach()` hook we set the page's test context with `page.setContext(this)`. That tells the page object to use the test's `this.$()` to find elements, instead of Ember's global acceptance test helpers.
- In the `afterEach()` hook, we call `page.removeContext()` to clear the test context from the page object.
- The rest of the changes are the same as in our acceptance tests: After you set the test's `this` context on the page object, you can use the page object as before. (The one exception is `page.visit()`, which doesn't work in component tests since we don't have access to a router.)

As in our acceptance tests, we can DRY things up a bit more by grouping actions together into methods that describe specific user flows. For example, in the first test we can use our `page.loginSuccessfully()` method to eliminate a few lines of code:

```js
test('calls submit action with correct username and password', function(assert) {
  assert.expect(2);

  function submit(username, password) {
    assert.equal(username, 'admin');
    assert.equal(password, 'secret');
  }

  this.set('submit', submit);

  this.render(hbs`{{login-form
    submit=(action submit)
  }}`);

  page.loginSuccessfully();
});
```

And that's it! Our integration and acceptance tests are cleaner, more maintainable and easier to read.

## Appendix

A helpful tip is to separate the exports in component page objects. This will allow you to compose larger page objects using the same definitions. For example say we have an integration test of a `my-fanfare` component:

```js
import {
  create,
  clickable,
  isVisible
} from 'ember-cli-page-object';

export const MyFanfare = {
  scope: '.ui-my-fanfare',
  playFanfare: clickable('button'),
  isCelebrating: isVisible('.fireworks')
};

export default create(MyFanfare);
```

This separation gives us two `import`-able signatures. In the case of the component's integration test importing the `default` will work as expected:

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import page from 'my-app/tests/pages/components/my-fanfare';

moduleForComponent('my-fanfare', 'Integration | Components | my fanfare', {
  integration: true,
  beforeEach() {
    page.setContext(this);
  },
  afterEach() {
    page.removeContext();
  }
});

test('it show fireworks when user clicks fanfare button', function (assert) {
  this.render(hbs`{{my-fanfaire}}`);
  page.playFanfare();
  assert.ok(page.isCelebrating, 'expected fireworks to have happened');
});
```

Then in the case of an acceptance test where the page object happens to include a `my-fanfare` component we can add that definition to the page object we are using in the acceptance test(s):

```js
import { 
  create,
  visitable,
  fillable,
  clickable
} from 'ember-cli-page-object';

import { MyFanfare } from 'frontend/tests/pages/components/my-fanfare';

export default create({
  visit: visitable('/'),
  enterName: fillable('input.username'),
  register: clickable('button.register'),
  myFanfare: MyFanfare
});
```

Which will allow us to reference the `MyFanfare` component from the acceptance test.

```js
assert.ok(page.myFanfare.isCelebrating, 'expected fireworks to have happened');
```

Some manipulation could be added (for example picking the first instance only):

```js
import { assign } from '@ember/polyfills';
import { create } from 'ember-cli-page-object';
import { MyFanfare } from 'frontend/tests/pages/components/my-fanfare';

export default create({
  myFanfare: assign({eq: 0}, MyFanfare)
});
```
{% endraw %}
