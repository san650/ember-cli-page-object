# Ember Page Objects

[![Build Status](https://travis-ci.org/san650/ember-cli-page-object.svg?branch=master)](https://travis-ci.org/san650/ember-cli-page-object)
![Latest version](https://img.shields.io/npm/v/ember-cli-page-object.svg)

Represent the screens of your web app as a series of objects. This ember-cli
addon eases the construction of these objects on your acceptance tests.

http://ember-cli-page-object.js.org/

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

## Documentation

Check the [site](http://ember-cli-page-object.js.org/) for full documentation.

## Usage

Install the npm package on your ember-cli project

```sh
npm install --save-dev ember-cli-page-object
```

then you can use it from your acceptance tests

```js
import PageObject from '../page-object';

const { fillable, text, visitable } = PageObject;

const login = PageObject.create({
  visit: visitable('/login'),
  userName: fillable('#username'),
  password: fillable('#password'),
  errorMessage: text('.message')
});

test('Invalid log in', function(assert) {
  login
    .visit()
    .userName('user@example.com')
    .password('secret')
    .clickOn('Log in');

  andThen(function() {
    assert.equal(login.errorMessage(), 'Invalid credentials!');
  });
});
```

## Blueprints

The addon includes the following blueprints

* `page-object` Creates a new page object
* `page-object-component` Creates a new a component to be used in a page object
* `page-object-helper` Creates a new a helper to be used in a page object

You can create a new page object called `users` using the `generate` command

```sh
$ ember generate page-object users

installing
  create tests/pages/users.js
```

```js
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import page from '../pages/users';

moduleForAcceptance();

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

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

### Project's health

[![Build Status](https://travis-ci.org/san650/ember-cli-page-object.svg?branch=master)](https://travis-ci.org/san650/ember-cli-page-object)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-page-object.svg)](http://emberobserver.com/addons/ember-cli-page-object)
[![Dependency Status](https://david-dm.org/san650/ember-cli-page-object.svg)](https://david-dm.org/san650/ember-cli-page-object)
[![devDependency Status](https://david-dm.org/san650/ember-cli-page-object/dev-status.svg)](https://david-dm.org/san650/ember-cli-page-object#info=devDependencies)
[![Codacy Badge](https://api.codacy.com/project/badge/35545e8e8ade48dfa999a3f5e1aa4b3b)](https://www.codacy.com/app/san650/ember-cli-page-object)
[![Code Climate](https://codeclimate.com/github/san650/ember-cli-page-object/badges/gpa.svg)](https://codeclimate.com/github/san650/ember-cli-page-object)

## License

ember-cli-page-object is licensed under the MIT license.

See [LICENSE](./LICENSE) for the full license text.
