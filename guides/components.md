---
layout: page
title: Components
---

Components is a way to describe some functional part of the DOM with a convenient API. You can compose a component from the other components, attributes and methods to achieve a great level of reusability.

* [Scopes](#scopes)
* [Attributes](#attributes)
* [Default attributes](#default-attributes)

## Scopes

Each component must have a `scope` which is a CSS selector.

```js
import { create } from 'ember-cli-page-object';

const f = create({
  scope: '.MyForm',

  magic: {
    scope: '.SomeMagic'
  }
});

```

Nested components take into account a parent scope while building a query selector. 

```js
// built selector: ".MyForm .MagicButton"
assert.equal(f.magic.isVisible, true);
```

Scope is calculated when you access some compmonent attributes like `isVisible`, `click`, etc,. If few DOM nodes are matched an exception occurs.

For more details for configuring a query selector please take a look at [Query Options](./query-options) page.

## Attributes

We can also define attributes on a component as follows:

```js
import { hasClass, clickable } from 'ember-cli-page-object';

const page = create({
  scope: 'form',

  input: {
    scope: '[data-test-datum]',

    hasError: hasClass('has-error'),
  },

  submit: clickable('button')
});

await page.datum.fillIn('an invalid value');

await page.submit();

assert.ok(page.datum.hasError, 'Input has an error');
```

## Default Attributes

All components are supplied with default attributes without being explicitly declared. 

Here is a list of all the component default attributes:

* [as](./api/as)
* [blur](./api/blur)
* [click](./api/clickable)
* [clickOn](./api/click-on-text)
* [contains](./api/contains)
* [fillIn](./api/fillable)
* [focus](./api/focus)
* [isHidden](./api/is-hidden)
* [isPresent](./api/is-present)
* [isVisible](./api/is-visible)
* [select](./api/selectable)
* [text](./api/text)
* [value](./api/value)
