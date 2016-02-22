---
layout: page
title: Components
---

Group attributes and create new ones

* [Components](#components)
* [Default attributes](#default-attributes)
* [.collection](#collection)
* [.customHelper](#customhelper)
* [Scopes](#scopes)

## Components

Components let you group attributes together, they are just plain objects with attributes on it. Components can define a scope.

__Example__

```html
<h1>New user</h1>
<form class="awesome-form">
  <input id="firstName" placeholder="First name">
  <input id="lastName" placeholder="Last name">
  <button>Create</button>
</form>
```

```js
const { visitable, text, fillable, clickable } = PageObject;

var page = PageObject.create({
  visit: visitable('/user/create'),
  title: text('h1'),

  form: {
    scope: '.awesome-form',

    firstName: fillable('#firstName'),
    lastName: fillable('#lastName'),
    submit: clickable('button')
  }
});

page
  .visit()
  .form()
  .firstName('John')
  .lastName('Doe')
  .submit();

andThen(function() {
  // assert something
});
```

## Default attributes

By default, all components define some handy attributes and methods without being explicitely declared.

* [isVisible](/api/predicates/#isvisible)
* [isHidden](/api/predicates/#ishidden)
* [clickOn](/api/actions/#clickontext)
* [click](/api/actions/#clickable)
* [contains](/api/predicates/#contains)
* [text](/api/queries/#text)

<div class="alert alert-warning" role="alert">
  <strong>Note</strong> that these attributes will use the component scope as their selector.
</div>

__Example__

Suppose you have a modal dialog

```html
<div class="modal">
  Are you sure you want to exit the page?
  <button>I'm sure</button>
  <button>No</button>
</form>
```

```js
const { visitable } = PageObject;

var page = PageObject.create({
  visit: visitable('/'),

  modal: {
    scope: '.modal'
  }
});

page.visit();

andThen(function() {
  assert.ok(page.modal.contains('Are you sure you want to exit the page?'));
});

page.modal.clickOn("I'm sure");
```

## .collection

Easily model a table or a list of items.

__Attribute signature__

```js
PageObject.collection(definition)
```

The collection definition has the following structure

```js
{
  itemScope: '', // css selector

  item: {
    // item attributes
  },

  // collection attributes
}
```

The attributes defined in the `item` object are scoped using the `itemScope` selector. The attributes defined outside the `item` object are available at collection scope.

__Example__

```html
<table id="users">
  <caption>The list of users</caption>
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
const { visitable, text, collection } = PageObject;

var page = PageObject.create({
  visit: visitable('/users'),

  users: collection({
    itemScope: '#users tr',

    item: {
      firstName: text('td', { at: 0 }),
      lastName: text('td', { at: 1})
    },

    caption: text('#users caption')
  })
});

test('show all users', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(login.users.caption, 'The list of users');
    assert.equal(login.users.count(), 2); // count attribute is added for free
    assert.equal(login.users(0).firstName, 'Jane');
    assert.equal(login.users(0).lastName, 'Doe');
    assert.equal(login.users(1).firstName, 'John');
    assert.equal(login.users(1).lastName, 'Doe');
  });
});
```

<div class="alert alert-warning" role="alert">
  <strong>Note</strong> that ember-cli-page-object collections are now 0-based arrays!
</div>

## .customHelper

Custom helpers are no longer supported, but you can migrate away from
them by creating `Ceibo` descriptors. (`Ceibo` is a small library for
parsing trees. You can check it out [here](http://github.com/san650/ceibo)).

With the old `v0.x` syntax, you would define a custom helper like:

```js
var disabled = customHelper(function(selector, options) {
  return $(selector).prop('disabled');
});
```

On version `1.x` this can be represented as:

```js
import { findElement } from './page-object';

export default function disabled(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      return findElement(this, selector, options).is(':disabled');
    }
  }
}
```

Example usage:

```js
let page = PageObject.create({
  scope: '.page',

  isAdmin: disabled('#override-name')
});
```

`page.isAdmin` will look for elements in the DOM that match ".page
\#override-name" and check if they are disabled.

## Scopes

The `scope` attribute can be used to reduce the set of matched elements to the ones enclosed by the given selector.

Given the following HTML

```html
<div class="article">
  <p>Lorem ipsum dolor</p>
</div>
<div class="footer">
  <p>Copyright 2015 - Acme Inc.</p>
</div>
```

the following configuration will match the article paragraph element

```js
var page = PageObject.create({
  scope: '.article',

  textBody: PageObject.text('p'),
});

andThen(function() {
  assert.equal(page.textBody, 'Lorem ipsum dolor.');
});
```

The attribute's selector can be omited when the scope matches the element we want to use.

Given the following HTML

```html
<form>
  <input id="userName" value="a value" />
  <button>Submit</button>
</form>
```

We can define several attributes on the same `input` element as follows

```js
var page = PageObject.create({
  input: {
    scope: '#userName',

    hasError: hasClass('has-error'),
    value: value(),
    fillIn: fillable()
  },

  submit: clickable('button')
});

page
  .input()
  .fillIn('an invalid value');

page.submit();

andThen(function() {
  assert.ok(page.input.hasError, 'Input has an error');
});
```

### A `component` inherits parent scope by default

```html
<div class="search">
  <input placeholder="Search...">
  <button>Search</button>
</div>
```

```js
var page = PageObject.create({
  search: {
    scope: '.search',

    input: {
      fillIn: fillable('input'),
      value: value('input')
    }
  }
});
```

| call                      | translates to                 |
|:--------------------------|:------------------------------|
| `page.search.input.value` | `find('.search input').val()` |
{: .table}

You can reset parent scope by setting the `scope` and `resetScope` attribute on the component declaration.

```js
var page = PageObject.create({
  search: {
    scope: '.search',

    input: {
      scope: 'input',
      resetScope: true,

      fillIn: fillable()
    }
  }
});
```

| call                      | translates to         |
|:--------------------------|:----------------------|
| `page.search.input.value` | `find('input').val()` |
{: .table}
