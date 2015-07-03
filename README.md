# Ember Page Objects [![Build Status](https://travis-ci.org/san650/ember-cli-page-object.svg?branch=master)](https://travis-ci.org/san650/ember-cli-page-object)

Represent the screens of your web app as a series of objects. This ember-cli
addon ease the construction of these objects on your acceptance tests.

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
import PO from '../page-object';
```

The previous example assumes that your test file is one level deep under
`tests/` folder. i.e. `tests/acceptance/my-acceptance-test.js`.

Then you can start building your page objects as follows:

```js
var login = PO.build({
  visit:        PO.visitable('/login'),
  userName:     PO.fillable('#username'),
  password:     PO.fillable('#password'),
  submit:       PO.clickable('#login'),
  errorMessage: PO.text('.message')
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
var page = PO.build({
  visit: PO.visitable('/users'),

  users: PO.collection({
    itemScope: '#users tr',

    item: {
      firstName: PO.text('td:nth-of-type(1)'),
      lastName:  PO.text('td:nth-of-type(2)')
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

You can use ES6 destructuring to declutter even more your page definition:

```js
var { visitable, collection, text } = PO;

var page = PO.build({
  visit: visitable('/users'),

  users: collection({
    itemScope: '#users tr',

    item: {
      firstName: text('td:nth-of-type(1)'),
      lastName:  text('td:nth-of-type(2)')
    }
  })
});
```

Check the [DOCUMENTATION](./DOCUMENTATION.md) for more information.

## Blueprints

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

## License

ember-cli-page-object is licensed under the MIT license.

See [LICENSE](./LICENSE) for the full license text.
