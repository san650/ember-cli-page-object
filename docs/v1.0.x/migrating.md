---
layout: page
title: Migration Guide
---

Migrating from ember-cli-page-object v0.x to v1.x? Here are the main changes you need to know about:

- [.customHelper](#customhelper)
- [Collections](#collections)
- [Getting the value of queries and predicates](#queries-and-predicates)
- [.visitable()](#visitable)
- [.clickOnText()](#clickontext)

## .customHelper

`.customHelper` is now deprecated. Use `Ceibo` descriptors instead. (`Ceibo` is a small library for parsing trees. You can check it out [here](http://github.com/san650/ceibo).)

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

## Collections

`collection` s are now 0-indexed. (Previously they were 1-indexed.)

## Queries and predicates

In v0.x, when you defined a query or predicate on a page object, you needed to call it as a method with parens (`()`). Now they are accessed as object properties, without parens. You can see examples in the docs for [queries](/docs/v1.0.x/api/queries) and [predicates](/docs/v1.0.x/api/predicates).

## .visitable()

The signature for `.visitable()` has changed. Instead of receiving two distinct object parameters (dynamic segments and query params) now it receives only one.

The idea is to fill the dynamic segments first, using the values from the param object and then use the rest of the keys and values as query params.

```js
var page = create({
  visit: visitable('/users/:user_id')

});

page.visit({ user_id: 1, expanded: true  });

// is equivalent to

visit("/users/1?expanded=true");
```

## .clickOnText()

The behaviour of `.clickOnText()` has improved. When looking for elements to click (based on text), the property now considers the parent element as a valid element to click. This allows to do things like

```html
<div class="modal">
...
<button>Save</button><button>Cancel</button>
```

```js
var page = PageObject.create({
  clickButton: clickOnText('button'),
  clickOn: clickOnText('.modal')
});

// ...

page.clickButton('Save');
page.clickOn('Save');
```

Before, the first action (`clickButton`) would not have worked, only the second action would have found the element. Now, both actions work and both actions do click the same button.
