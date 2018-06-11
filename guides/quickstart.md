---
layout: page
title: Quickstart
---

{% raw %}
This is a short guide to get you started writing page objects and using them in your tests.

- [The Challenge](#the-challenge)
- [Modeling Components](#modeling-components)
- [Macroses](#macroses)
- [Higher Order Methods](#higher-order-methods)
- [Application Tests](#application-tests)
- [Interoperability](#interoperability)

## The Challenge

Suppose we have a simple login form component with the following result markup:

```html
<form>
  <span data-test-error></span>

  <div data-test-username class="has-error">
    <label for="username">Username:</label>
    <input id="username" />
    <span class="error-message"></span>
  </div>

  <div data-test-password class="has-error">
    <label for="password">Password:</label>
    <input id="password" />
    <span class="error-message"></span>
  </div>

  <button [data-test-save]>Save</button>
</form>
```

First let's take a look on a typical Ember component tests for this form:

```js
test('it requires username and password', async function(assert) {
  await render(hbs`{{login-form}}`);

  await click('[data-test-save]');

  assert.dom('[data-test-username]').hasClass('has-error');
  assert.dom('[data-test-username] .error-message').hasText('Username is required');

  assert.dom('[data-test-password]').hasClass('has-error');
  assert.dom('[data-test-password] .error-message').hasText('Password is required');
});

test('it successfully submits', async function(assert) {
  await render(hbs`{{login-form}}`);

  await fillIn('[data-test-username] input', 'Username')
  await fillIn('[data-test-password] input', 'Password')

  await click('[data-test-save]');

  assert.dom('[data-test-username]').doesNotHaveClass('has-error');
  assert.dom('[data-test-username] .error-message').doesNotExist();

  assert.dom('[data-test-password]').doesNotHaveClass('has-error');
  assert.dom('[data-test-password] .error-message').doesNotExist();
});
```

That's quite a straightforward and simple test. So why do we even need to use Page Object here?

In the nutshell the issue with this kind of tests is that it heavily relies on css selectors.

For the instance let's take a look on the `username` field from the testing standpoint: 
  - All the `username` operation are scoped with `[data-test-username]`. 
  - In order to check if it's highlighted as an error we check if the `has-error` class exists.
  - In order to check an error message we access `[data-test-username] .error-message`.
  - In order to fill in the value we access `[data-test-username] input`.


The complexity grows for more sophisticated components or more complex components hierarchies. In addition in cases when the implementation or selectors changes you may end up updating all the related tests.

So how can we improve this with Page Object?

Page Object helps you to encapsulate difficulties of the UI layer in a declarative and composable way. Let's try it now!

## Modeling Components

First, we have to create a Page Object component:

```bash
$ ember generate page-object-component login-form

installing
  create tests/pages/components/login-form.js
```

Let's describe the login form structure on our new `login-form` component object:

```js
// app-name/tests/pages/components/login-form.js

export default {
  scope: 'form',

  username: {
    scope: '[data-test-username]',

    errorMessage: {
      scope: '.error-message'
    }
  },

  password: {
    scope: '[data-test-password]',

    errorMessage: {
      scope: '.error-message'
    }
  },

  saveButton: {
    scope: '[data-test-save]'
  }
};
```

As you can see Page Object component can be represented a plain javascript object. It can also contain deeply nested components like `username` or `username.errorMessage`. The only requirement for component is to have a `scope` property with a CSS selector value which allows us to map components to the DOM. 

Out of the box each component has a set of supplied helpers like `isVisible`, `click`, `fillIn`, `text` and [others](./api/components#default-attributes). This allows us to do some cool things with our page object right now:

```js
import { create } from 'ember-cli-page-object';
import LoginForm from 'app-name/tests/pages/components/login-form';

// before usage the page should be created from the definition
const loginForm = create(LoginForm);

test("Compoent built-ins demo", async function() {
  await render(hbs`{{login-form}}`)

  assert.ok(loginForm.isVisible);

  await loginForm.submitButton.click();

  assert.equal(loginForm.username.errorMessage.text, 'Username is required');
})
```

Great! We've got closer.

Now we have to improve definitions for the `username` and `password` in order to be able to check for `has-error` class existance and filling it in of course.

In addition to built-in component helpers Page Object also provides us with a set of properties which you can use to extend the component functionality. We would use `hasClass` helper to check if the `username` is invalid:

```js
import { hasClass } from 'ember-cli-page-object';

export default {
  scope: 'form',

  username: {
    scope: '[data-test-username]'

    // Add `hasError` boolean property
    hasError: hasClass('has-error'),

    errorMessage: {
      scope: '.error-message'
    }
  },

  // ...
}
```

Now `hasError` can be used as a `username` getter:

```js
assert.ok(loginForm.username.hasError);
```

The last missing part is filling an input with a value.

As mentioned above there is a built-in `fillIn` component property supplied for each component. Howerver if we call `fillIn` on the `username` right now it would fail because the `username` comforms to the `div[data-test-username]` which can't be filled in. We need instruct `fillIn` to deal with an `input` children node.

```js
import { hasError, fillable } from 'ember-cli-page-object';

export default {
  scope: 'form',

  username: {
    scope: '[data-test-username]'

    hasError: hasClass('has-error'),

    // All the parent scopes are getting prepended to the final selector
    // so the final selector would become "form [data-test-username] input"
    fillIn: fillable('input'),

    errorMessage: {
      scope: '.error-message'
    }
  },

  // ...
}
```

That's it. Our `username` is ready to be used in the tests. But what about the `password`? Should we copy-paste all the `username` implementation into it?

## Macroses

Well, the only difference between  the `username` and `password` is a `scope` selector. It could be annoying to repeat the whole field definition accross all the similar fields. 

In order to reduce the duplication we can extract a field definition creation to a separate macros and re-use it for any input field component in our project:

```js
/**
 * Assembles a regular input with a configurable scope
 */
function formInput(scope) {
  return {
    scope,

    fillIn: fillable('input'),

    hasError: hasClass('has-error')

    errorMessage: {
      scope: '.error-message'
    },
  },
}

```

With this change the final version of our `login-form` component definition would look like:

```js
import { inputField } from '../macros/input-field';

export default {
  scope: 'form',

  username: inputField('[data-test-username]'),

  password: inputField('[data-test-password]'),

  saveButton: {
    scope: '[data-test-save]'
  }
};
```

And the test looks like:

```js
import { create } from 'ember-cli-page-object';
import LoginForm from 'app-name/tests/pages/components/login-form';

const form = create(LoginForm);

test('it requires username and password', async function(assert) {
  await render(hbs`{{login-form}}`);

  await form.submitButton.click();

  assert.ok(form.username.hasError);
  assert.equal(form.username.errorMessage.text, 'Username is required');

  assert.ok(form.password.hasError);
  assert.equal(form.password.errorMessage.text, 'Password is required');
});

test('it successfully submits', async function(assert) {
  await render(hbs`{{login-form}}`);

  await form.username.fillIn('Username')
  await form.password.fillIn('Invalid Password')
  await form.submitButton.click();

  assert.notOk(form.username.hasError);
  assert.notOk(form.username.errorMessage.isVisible);

  assert.notOk(form.password.hasError);
  assert.notOk(form.password.errorMessage.isVisible);
});
```

Now all the DOM implementation details of the `login-form` are abstracted away with a Page Object. It improves test readability and feel safer while refactoring. 

## Higher Order Methods

Of course we can always go a step further and describe the steps of the test using a higher level of abstraction. For example in our particular case we can make a shorthand for the form submission:

```js
import { inputField } from '../macros/input-field';

export default {
  scope: 'form',

  username: inputField('[data-test-username]'),

  password: inputField('[data-test-password]'),

  saveButton: {
    scope: '[data-test-save]'
  },

  async submit(data = {}) {
    await this.username.fillIn(data.username);
    await this.password.fillIn(data.password);

    await this.saveButton.click();
  }
};
```

Then

```js
  await form.username.fillIn('Username');
  await form.password.fillIn('Password');
  await form.submitButton.click();
```

can be re-written as:

```js
  await form.submit({
    username: 'Username',
    password: 'Invalid Password'
  });
```

## Application Tests

Now we have a complete Page Object representation for the `login-form` component. We can re-use Page Object components in the different Page Objects to get a comprehensive Page API.

Let's assume we want to test an integration of a hypothetical "Dashboard Page" with a "Login Page". It is obviously a call for an Ember Application test since the routing is involved here.

Let's create a Dashboard page:

```bash
$ ember generate page-object dashboard

installing
  create tests/pages/dashboard.js
```

```js
// app-name/tests/pages/dashboard.js

import { create, visitable } from 'ember-cli-page-object';

export default create({
  visit: visitable('/dashboard'),

  scope: '[data-test-dashboard-page]'
});
```

This page object allows us to visit the Dashboard and to check if the page is currently visible. This should be enough for our simple demo test cases.

Now let's create a Login Page and include our fresh `login-form` component into it:

```bash
$ ember generate page-object login

installing
  create tests/pages/login.js
```

```js
// app-name/tests/pages/login.js

import { create, visitable } from 'ember-cli-page-object';

import LoginForm from './components/login-form';

export default create({
  visit: visitable('/dashboard'),

  scope: '[data-test-login-page]',

  form: LoginForm
});
```

We can now write our Application tests:

```js
import dashboardPage from 'app-name/tests/pages/dashboard';
import loginPage from 'app-name/tests/pages/login';

// test setup here...

test(`Dashboard requires authentificated user`, async function(assert) {
  await dashboardPage.visit();

  assert.notOk(dashboardPage.isVisible);
  assert.ok(loginPage.isVisible);
});

test(`Redirects to the Dashboard after sucessful authentification`, async function(assert) {
  await loginPage
    .visit()
    .submit({
      username: 'Username',
      password: 'Secret'
    });

  assert.ok(dashboardPage.isVisible);
  assert.notOk(loginPage.isVisible);
});
```

And that’s it! Now our tests are flexible, expressible and maintainable.

## Interperability

And last but not least. The nature of EmberCLI Page Object allows us to easily switch different test helpers implementations without any changes required in the page objects itself.

For example you can transition from the Ember 2 style `ember-test-helpers` to the Ember 3 `@ember/test-helpers` literally for free. EmberCLI Page Object would take care to select a proper test helpers implementation based on the current test module type!

The only caveat you shoud be aware of is the additional API for Ember 2 Integration tests. In order to enable it you have to `setContext`:

```js
moduleForComponent('login-form', 'Integration | login form', {
  integration: true,

  beforeEach() {
    // This would tell EmberCLI Page Object to enable integration tests mode
    page.setContext(this);
  },

  afterEach() {
    // you should also remove context
    // in order to avoid side effects in the following tests
    page.removeContext();
  }
});

test('it successfully submits', async function(assert) {
  await render(hbs`{{login-form}}`);

  await form.username.fillIn('Username')
  await form.password.fillIn('Invalid Password')
  await form.submitButton.click();

  assert.notOk(form.username.hasError);
  assert.notOk(form.username.errorMessage.isVisible);

  assert.notOk(form.password.hasError);
  assert.notOk(form.password.errorMessage.isVisible);
});
```

{% endraw %}
