---
layout: guide
title: 'Using "async" and "await" with ember-cli-page-object'
---

TC39 has a [proposal](https://tc39.github.io/ecmascript-asyncawait/) for adding async functions to ECMAScript. This new language feature is very useful for working with the promise pattern that is heavily used in Ember's acceptance tests.

Babel supports async functions through a _polyfill_ which _transpiles_ the `async` and `await` keywords into valid ES5 JavaScript. Before starting to use the new `async` and `await` keywords we need to tell ember-cli to include the Babel polyfills.

_ember-cli-build.js_

```js
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    babel: {
      includePolyfill: true
    }
  });

  return app.toTree();
};
```

Now you can start using `async` and `await` keywords in your project, specially in your acceptance tests.

Imagine that we have the following acceptance test:

```js
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import { create, clickable, fillable, text, visitable } from 'ember-cli-page-object';

const page = create({
  visit: visitable('/login'),
  userName: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  message: text('.message')
});

test('validates invalid credentials', function(assert) {
  page
    .visit()
    .userName('john doe')
    .password('wrong password')
    .submit();

  andThen(function() {
    assert.equal(page.message, 'Invalid user name or password');
  });

  page
    .password('secret')
    .submit();

  andThen(function() {
    assert.equal(page.message, 'Welcome back John Doe');
  });
});
```

You can update this test to use the `async` and `await` keywords as follows

```js
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import { create, clickable, fillable, text, visitable } from 'ember-cli-page-object';

const page = create({
  visit: visitable('/login'),
  userName: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  message: text('.message')
});

test('validates invalid credentials', async function(assert) {
  await page
    .visit()
    .userName('john doe')
    .password('wrong password')
    .submit();

  assert.equal(page.message, 'Invalid user name or password');

  await page
    .password('secret')
    .submit();

  assert.equal(page.message, 'Welcome back John Doe');
});
```

As you can see, [ember-cli-page-object](https://github.com/san650/ember-cli-page-object)'s actions support the `await` keyword, even if you chain multiple actions. Also note that you have to mark the test function as asynchronous `async function(assert)`.

Take a look at [this commit](https://github.com/san650/tajpado/commit/6638a26564e41f3503886dbe36bf860b2f6d7ac1) of the [tajpado](https://github.com/san650/tajpado) project to see how we upgraded the project to start using `async` and `await` in the test suite.

## A note about JSHint

JSHint doesn't like the new _async_ and _await_ keywords so it returns a handful of errors. To disable JSHint on a particular file you can add a comment directive on top of the file.

```js
/* jshint ignore:start */
```

Note that JSHint will process all files of the project except the ones that contains this comment.

## The future

There's a proposal in Ember.js by [Robert Jackson](https://github.com/rwjblue) (see the [RFC](https://github.com/emberjs/rfcs/pull/119)) to use async functions as the default way to write acceptance test. Although this proposal is in an early stage it seems to have a good reception by the community.

See https://github.com/rwjblue/rfcs/blob/42/text/0000-grand-testing-unification.md#async--await

---

_This post was originally published on [https://wyeworks.com/blog/2016/6/13/using-async-and-await-with-ember-cli-page-object/](https://wyeworks.com/blog/2016/6/13/using-async-and-await-with-ember-cli-page-object/)_
