# Ember Page Objects

Represent the screens of your web app as a series of objects.

## References

* [Page Objects](https://code.google.com/p/selenium/wiki/PageObjects) - Selenium wiki
* [PageObject](http://martinfowler.com/bliki/PageObject.html) - Martin Fowler

## Usage

First add the npm package to your ember-cli project

```sh
npm install --save-dev ember-cli-page-object
```

Now you can reference `page-object` from your Acceptance tests

```js
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import PO from 'page-object';

var application;

module('An Integration test', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

var login = PO.build({
  visit: PO.visitable('/login'),
  userName: PO.fillable('#username'),
  password: PO.fillable('#password'),
  submit: PO.clickable('#login'),
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

Support for tables and collections

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
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import PO from 'page-object';

var application;

module('Users', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

var page = PO.build({
  visit: PO.visitable('/users'),

  users: PO.collection({
    itemScope: '#users tr',

    item: {
      firstName: PO.text('td:nth-of-type(1)'),
      lastName: PO.text('td:nth-of-type(2)')
    }
  })
});

test('show all users', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(login.users().count(), 2);
    assert.equal(login.users(1).firstName(), 'Jane');
    assert.equal(login.users(1).lastName(), 'Doe');
    assert.equal(login.users(2).firstName(), 'John');
    assert.equal(login.users(2).lastName(), 'Doe');
  });
});
```

Check [DOCUMENTATION](./DOCUMENTATION.md) for more information.

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

## License

ember-cli-page-object is licensed under the MIT license.

See [LICENSE](./LICENSE) for the full license text.
