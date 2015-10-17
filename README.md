# Ember Page Objects [![Build Status](https://travis-ci.org/san650/ember-cli-page-object.svg?branch=master)](https://travis-ci.org/san650/ember-cli-page-object)

Represent the screens of your web app as a series of objects. This ember-cli
addon eases the construction of these objects on your acceptance tests.

## What is a Page Object?

An excerpt from the Selenium Wiki
> Within your web app's UI there are areas that your tests interact with. A Page
> Object simply models these as objects within the test code. This reduces the
> amount of duplicated code and means that if the UI changes, the fix need only
> be applied in one place.

The pattern was first introduced by the Selenium

You can find more information about this design pattern here:
* [Page Objects - Selenium wiki](https://code.google.com/p/selenium/wiki/PageObjects)
* [PageObject - Martin Fowler](http://martinfowler.com/bliki/PageObject.html)

## Usage

Install the npm package on your ember-cli project

```sh
npm install --save-dev ember-cli-page-object
```

then import the page-object helper

```js
import PageObject from '../page-object';
```

The previous example assumes that your test file is one level deep under
`tests/` folder. i.e. `tests/acceptance/my-acceptance-test.js`.

Then you can start building your page objects as follows:

```js
var { clickable, fillable, text, visitable } = PageObject;

var login = PageObject.create({
  visit: visitable('/login'),
  userName: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('#login'),
  errorMessage: text('.message')
});

test('Invalid log in', function(assert) {
  login
    .visit()
    .userName('user@example.com')
    .password('secret')
    .submit();

  andThen(function() {
    assert.equal(login.errorMessage(), 'Invalid credentials!');
  });
});
```

Built-in support for defining tables and collections:

```html
<table id="users">
  <tr>
    <td>Jane</td>
    <td>Doe</td>
  </tr>
  <tr>
    <td>John</td>
    <td>Doe</td>
  </tr>
</table>
```

```js
var { collection, text, visitable } = PageObject;

var page = PageObject.create({
  visit: visitable('/users'),

  users: collection({
    itemScope: '#users tr',

    item: {
      firstName: text('td:nth-of-type(1)'),
      lastName: text('td:nth-of-type(2)')
    }
  })
});

test('show all users', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(page.users().count(), 2);
    assert.equal(page.users(1).firstName(), 'Jane');
    assert.equal(page.users(1).lastName(), 'Doe');
    assert.equal(page.users(2).firstName(), 'John');
    assert.equal(page.users(2).lastName(), 'Doe');
  });
});
```

## Documentation

Check the full [DOCUMENTATION](./DOCUMENTATION.md) for more information.

## Blueprints

The addon includes the following blueprints

| Name | Description |
| -------- | --------------- |
| `page-object` | Creates a new page object under `tests/pages` folder |
| `page-object-component` | Creates a new a component object to be used on a page object under `tests/pages/components` folder. |
| `page-object-helper` |  Creates a new a helper object to be used on a page object under `tests/pages/helpers` folder. |

You can create a new page object called `users` using the `generate` command

```sh
$ ember generate page-object users

installing
  create tests/pages/users.js
```

A new file will be generated under `tests/pages` folder and can be included on
an acceptance test like follows

```js
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import page from '../pages/users';

var application;

module('Acceptance: UserList', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /users', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(currentPath(), 'users');
  });
});
```

## Development

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build`

### Project's health

[![Build Status](https://travis-ci.org/san650/ember-cli-page-object.svg?branch=master)](https://travis-ci.org/san650/ember-cli-page-object)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-page-object.svg)](http://emberobserver.com/addons/ember-cli-page-object)
[![Dependency Status](https://www.versioneye.com/user/projects/5622d5e836d0ab0021000b31/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5622d5e836d0ab0021000b31)
[![Codacy Badge](https://api.codacy.com/project/badge/35545e8e8ade48dfa999a3f5e1aa4b3b)](https://www.codacy.com/app/san650/ember-cli-page-object)

## License

ember-cli-page-object is licensed under the MIT license.

See [LICENSE](./LICENSE) for the full license text.
