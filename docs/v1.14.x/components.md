---
layout: page
title: Components
---

Group attributes and create new ones

* [Components](#components)
* [Default attributes](#default-attributes)
* [Custom helper](#custom-helper)
* [Scopes](#scopes)

## Components

Components let you group attributes together, they are just plain objects with attributes on it. You can even define these objects in different files and reuse them in multiple places. Components can define a scope.

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
import {
  create,
  visitable,
  text,
  fillable,
  clickable
} from 'ember-cli-page-object';

const page = create({
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
  .form
  .firstName('John')
  .lastName('Doe')
  .submit();

andThen(function() {
  // assert something
});
```

## Default attributes

By default, all components define some handy attributes and methods without being explicitly declared.

* [as](/docs/v1.14.x/api/as)
* [blur](/docs/v1.14.x/api/blur)
* [click](/docs/v1.14.x/api/clickable)
* [clickOn](/docs/v1.14.x/api/click-on-text)
* [contains](/docs/v1.14.x/api/contains)
* [fillIn](/docs/v1.14.x/api/fillable)
* [focus](/docs/v1.14.x/api/focus)
* [isHidden](/docs/v1.14.x/api/is-hidden)
* [isPresent](/docs/v1.14.x/api/is-present)
* [isVisible](/docs/v1.14.x/api/is-visible)
* [select](/docs/v1.14.x/api/selectable)
* [text](/docs/v1.14.x/api/text)
* [value](/docs/v1.14.x/api/value)

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
import { create, visitable } from 'ember-cli-page-object';

const page = create({
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

## Scopes

The `scope` attribute can be used to reduce the set of matched elements to the ones enclosed by the given selector.

Given the following HTML

```html
<div class="article">
  <p>Lorem ipsum dolor</p>
</div>
<div class="footer">
  <p>Copyright Acme Inc.</p>
</div>
```

the following configuration will match the article paragraph element

```js
const page = create({
  scope: '.article',

  textBody: text('p'),
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
const page = create({
  input: {
    scope: '#userName',

    hasError: hasClass('has-error'),
    value: value(),
    fillIn: fillable()
  },

  submit: clickable('button')
});

page
  .input
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
const page = create({
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
const page = create({
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
