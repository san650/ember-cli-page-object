---
layout: page
title: Migration Guide
---
{% raw %}
In the update to ember-cli-page-object v1.x, we've defined more intuitive behavior and moved to a more polished and mature API.

This sounds great, but it also comes with a cost: you need to migrate your test suite. This page includes a list of breaking changes and API enhancements to help you upgrade as quickly and painlessly as possible.

- [Change `build()` calls to `create()` calls](#change-build-calls-to-create-calls)
- [Components are now just plain objects](#components-are-now-just-plain-objects)
- [`.customHelper` is deprecated](#customhelper)
- [Collections are now 0-based](#collections-are-now-0-based)
- [`index` option renamed to `at` and is 0-based](#index-option-renamed-to-at-and-is-0-based)
- [Remove parentheses when getting a value for a query or predicate](#remove-parentheses-when-getting-a-value-for-a-query-or-predicate)
- [Scope and `resetScope`](#scope-and-resetscope)
- [The `multiple` option](#the-multiple-optionm)
- [`.visitable()`](#visitable)
- [`.clickOnText()`](#clickontext)

## Change `build()` calls to `create()` calls

This is very simple:

```js
const page = PageObject.build({
  // ...
});
```

Should be changed to:

```js
const page = PageObject.create({
  // ...
});
```

## Components are now just plain objects

In `v0.x` we deprecated the `component` function. In `v1.0` we
removed it completely in favor of using plain JS objects.

```js
const page = PageObject.create({
  // ...
  modal: component({
    // modal component definition
  }),
  // ...
});
```

Should be changed to:

```js
const page = PageObject.create({
  // ...
  modal: {
    // modal component definition
  },
  // ...
});
```

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
import { findElement } from 'ember-cli-page-object/extend';

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

`page.isAdmin` will look for elements in the DOM that match ".page #override-name" and check if they are disabled.

## Collections are now 0-based

When we first implemented the `collection` function, we were using the
`nth-of-type` CSS pseudo-class which is 1-based, so we though it would
be clearer to also make collections 1-based. Later we decided to
change to an implementation to use `:eq`, which is `0-based`. We decided `v1.0`
was the moment to break compatibility and switch to 0-based collections.

```hbs
<table>
  <tbody>
    <tr>
      <td>Jane</td>
    </tr>
    <tr>
      <td>John</td>
    </tr>
  </tbody>
</table>
```

Example from the old `v0.x` syntax:

```js
const page = create({
  users: collection({
    itemScope: 'table tr',
    item: {
      name: text('td')
    }
  })
});

page.users(1).name(); //  returns 'Jane'
page.users(2).name(); //  returns 'John'
```

Example in `v1.x` syntax:

```js
const page = create({
  users: collection({
    itemScope: 'table tr',
    item: {
      name: text('td')
    }
  })
});

page.users(0).name; //  returns 'Jane'
page.users(1).name; //  returns 'John'
```

## `index` option renamed to `at` and is 0-based

In `v0.x`, the `index` option was used to reduce the set of matched elements to the
one at the specified index which was 1-based. A small example from `v0.x`:

```js
const page = create({
  secondTitle: text('h1', { index: 2 })
});

page.secondTitle(); // translates into $('h1:eq(1)').text()
```

In `v1.x` this should be changed to:

```js
const page = create({
  secondTitle: text('h1', { at: 1 })
});

page.secondTitle; // translates into $('h1:eq(1)').text()
```

## Remove parentheses when getting a value for a query or predicate 

In `v1` we decided to go a step further on improving the code and
polished the tree structure we already used when defining page objects.
The `Ceibo` project was born (you can see it over
[here](http://github.com/san650/ceibo)) which defines a simple way to
create complex properties within an object. So for most cases
properties used only to get a value will no longer need parentheses
when accessed.

```js
const page = create({
  scope: '#my-page',

  title: text('h1'),
  fillInName: fillable('#name')
});
```

In `v0.x` the following code was used within tests:

```js
assert.equal(page.title(), 'My page title');
page.fillInName('Juan'); // fill #name with 'Juan'
```

In `v1.x` this should be changed to:

```js
assert.equal(page.title, 'My page title');
page.fillInName('Juan'); // Doesn't change
```

## Scope and `resetScope`

In `v0.x` defining the `scope` attribute on a page object used to override how the element was looked up in the DOM. Example:

```js
const page = create({
  scope: '#my-page',

  title: text('h1'),
  fillInName: fillable('#name')

  modal: {
    scope: '#my-modal',
    title: PageObject.text('h3')
  }
});
```

When running tests in `v0.x`:

```js
page.title(); // translates to `find('#my-page h1').text()`
page.modal().title() //  transaltes to `find('#my-modal h3').text()`
```

In `v1.0` we decided to implement scope inheritance, this means that if a
component defines a scope and has a child component, the latter will
inherit its parent scope.

```js
page.title; // translates into find('#my-page h1').text()
page.modal.title //  transaltes into find('#my-page #my-modalh3').text()
```

In some scenarios, this change of behavior will not affect test
assertions but in some cases, it will. If you want to make sure lookups
work as in `v0.x` you can use the `resetScope` option (you can see more
options on the documentation [site](/docs/v1.1.x/options)).

Changed definition to keep lookups the same:

```js
const page = create({
  scope: '#my-page',

  title: text('h1'),
  fillInName: fillable('#name')

  modal: {
    scope: '#my-modal',
    resetScope: true,

    title: text('h3')
  }
});
```

## The `multiple` option

Another cause of failure when upgrading to `v1.x` is that, by default, an error will be thrown if multiple elements match a query or predicate.

For example, if the previous page object definition is used with the following template:

```hbs
<div class="#my-page">
  <h1>My title</h1>
  <h1>My other title</h1>
</div>
```

This call will throw an error:

```js
page.title; // Kaboom!
```

This behavior applies to every DOM lookup except `count`.

If you need to match multiple elements you can use the `multiple` option on
your properties. The resulting behavior will vary depending on the
property. As an example, you can check how the `multiple` option behaves on the `text`
property [here](/docs/v1.1.x/api/queries#text).

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
{% endraw %}
