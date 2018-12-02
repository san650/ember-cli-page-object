---
layout: page
title: Components
---

Describe functional fragments of the DOM

* [Definitions](#definitions)
* [Scopes](#scopes)
* [Attributes](#attributes)
  * [Actions](#actions)
  * [Default attributes](#default-attributes)

## Definitions

Components are created from definitions, which are just plain objects with attributes, methods, and nested definitions on them.

__Example__

```html
<form class="awesome-form">
  <input id="firstName" placeholder="First name">
  <input id="lastName" placeholder="Last name">
  <button>Create</button>
</form>
```

```js
import {
  clickable,
  fillable
} from 'ember-cli-page-object';

const FormDefinition = {
  scope: '.awesome-form',

  firstName: fillable('#firstName'),
  lastName: fillable('#lastName'),
  submit: clickable('button')
};
```

Component instances are built by the `create` function:

__Usage__
```js
import { create } from 'ember-cli-page-object';

const form = create(FormDefinition);

await form
  .firstName('John')
  .lastName('Doe')
  .submit();
```

The best way to describe complex interfaces is through the composition of simpler component definitions.

```js
import { create, visitable } from 'ember-cli-page-object';

const PageDefinition = {
  visit: visitable('/users/new'),

  form: FormDefinition
}

const myPage = create(PageDefinition);

await myPage.visit()
  .form
  .firstName('John')
  .lastName('Doe')
  .submit();
```

## Scopes

The `scope` attribute, which refers to the CSS selector that encloses a component, is used to target the corresponding DOM element during testing. Parent scopes are included when calculating a nested component's selector.

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

  textBody: {
    scope: 'p'
  }
});

assert.equal(page.textBody.text, 'Lorem ipsum dolor.');
```

When `page.textBody.text` is evaluated, each link in the hierarchy of page objects has its scope incorporated into the final selector that's used to find an element whose text is returned (`.article p` in this example).

You can avoid applying the parent `scope` to a particular component by setting the `resetScope` attribute on the component's definition to `true`.

```js
const form = create({
  scope: '.my-form',

  dialog: {
    scope: '.some-dialog',

    resetScope: true
  }
});

await form.clickOn('Cancel');

assert.ok(form.dialog.isVisible);
```

## Attributes

Attributes are just Page Object aware wrappers around low level DOM operations. They allow you to configure a component's testable behavior in a declarative fashion.

By default, attribute uses a parent component's `scope`:

```js
import { create, value } from 'ember-cli-page-object';

const input = create({
  scope: 'input[name="my-input"]',

  value: value()
})

assert.equal(input.value, 'some value');
```

In the assert statement above, the [`value`](./api/value) attribute queries a DOM element with the selector `input[name="my-input"]` and returns its DOM value property.

You can add further specificity by passing a selector as the attribute's argument:

```js
import { create, text } from 'ember-cli-page-object';

const customSelect = create({
  scope: '.my-select',

  value: text('.selected')
})

assert.equal(customSelect.value, 'some value');
```

In the assert statement above, the [`text`](./api/text) attribute queries a DOM element with the selector `.my-select .trigger` and returns its text value.

### Actions

Actions are a special kind of attribute that allow page objects to perform async operations on the DOM.

```js
import { create, fillable, triggerable } from 'ember-cli-page-object';

const form = create({
  scope: 'form.search-form',

  fillIn: fillable('input[type="search"]'),

  submit: triggerable('submit')
})

await form.fillIn('some text');
await form.submit();
```

The result of an action is a `Promise`-like chainable page object node.

Chaining allows you to write scenarios in the following way:

```js
await form
  .fillIn('some text')
  .submit();
```

### Default attributes

The following commonly used attributes are included in every component page object by default to help reduce the boilerplate.

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
