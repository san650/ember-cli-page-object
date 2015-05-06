# Ember Page Objects

Represent the screens of your web app as a series of objects.

## Description

An excerpt from the Selenium Wiki
> Within your web app's UI there are areas that your tests interact with. A Page Object simply models these as objects within the test code. This reduces the amount of duplicated code and means that if the UI changes, the fix need only be applied in one place.
The pattern was first introduced by the Selenium

This ember-cli addon ease the construction of Page Objects on your acceptance tests.

You can find more information about the design pattern here:
* [Page Objects - Selenium wiki](https://code.google.com/p/selenium/wiki/PageObjects)
* [PageObject - Martin Fowler](http://martinfowler.com/bliki/PageObject.html)

## Usage

First add the npm package to your ember-cli project

```sh
npm install --save-dev ember-cli-page-object
```

then import the page-object helper

```js
import PO from '../page-object';
```

The previous example assumes that your test file is one level deep under
`tests/` folder. i.e. `tests/unit/my-unit-test.js`.

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
    assert.equal(login.users().count(), 2);
    assert.equal(login.users(1).firstName(), 'Jane');
    assert.equal(login.users(1).lastName(), 'Doe');
    assert.equal(login.users(2).firstName(), 'John');
    assert.equal(login.users(2).lastName(), 'Doe');
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
