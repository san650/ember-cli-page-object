---
layout: page
title: Deprecations
---

This is a list of deprecations introduced in 1.x cycle:

## Set context

**ID**: ember-cli-page-object.set-context

**Until**: 2.0.0

With "@ember@test-helpers@1.0.0" or higher you don't need to set page object context anymore, it would be handled for you:

Bad:

```js
  page.setContext(this);
  page.removeContext(this);

  const page = create({
    context: this
  });
```

Good: Make sure you are using the most recent version of "@ember/test-helpers" and remove setting of context from your test suite.

## Comma-separated Selectors

**ID**: ember-cli-page-object.comma-separated-selectors

**Until**: 2.0.0

Comma separated selectors are not supported in ember-cli-page-object.

Bad:

```html
<h1>A big title</h1>
<h2>A smaller title</h2>
```

```js
import { create, text } from "ember-cli-page-object";

var page = create({
  title: text("h1, h2")
});
```

Good:

```html
<h1 data-test-title>A big title</h1>
<h2 data-test-title>A smaller title</h2>
```

```js
import { create, text } from "ember-cli-page-object";

var page = create({
  title: text("[data-test-title]")
})
```

## Import from test-support

**ID**: ember-cli-page-object.import-from-test-support

**Until**: 2.0.0

Importing page object helpers from `tests/` folder is deprecated. Please import from `ember-cli-page-object` instead.

Bad:

```js
import { create, text } from "my-app/tests/page-object";

var page = create({
  title: text("h1")
});
```

Good:

```js
import { create, text } from "ember-cli-page-object";

var page = create({
  title: text("h1")
});
```

## Old collection API

**ID**: ember-cli-page-object.old-collection-api

**Until**: 2.0.0

Usage of `item` and `itemScope` are now deprecated. Use the new simplified collections API instead:

```html
<table>
  <caption>List of users</caption>
  <tbody>
    <tr>
      <td>Mary<td>
      <td>Watson</td>
    </tr>
    <tr>
      <td>John<td>
      <td>Doe</td>
    </tr>
  </tbody>
</table>
```

Bad:

```js
const page = create({

  users: collection({
    itemScope: 'table tr',

    item: {
      firstName: text('td', { at: 0 }),
      lastName: text('td', { at: 1 })
    },

    caption: text('caption')
  });
});

// test
assert.equal(page.users().count, 2);
assert.equal(page.users(1).firstName, 'John');
```

Good:

```js
const page = create({
  users: collection('table tr', {
    firstName: text('td', { at: 0 }),
    lastName: text('td', { at: 1 })
  }),

  usersCaption: text('caption')
});

assert.equal(page.users.length, 2);
assert.equal(page.users.objectAt(1).firstName, 'John');
```

## Page Render

**ID**: ember-cli-page-object.page-render

**Until**: 2.0.0

Using `page.render('{{foo}}')` to render a component is deprecated. Please use `render` directly from your test framework instead:

```js
import { moduleForComponent, test } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { create } from 'ember-cli-page-object';

moduleForComponent('calculating-device', 'Deprecation | page.render()', {
  integration: true,

  beforeEach() {
    this.page = create({context: this});
  }
});

test('renders component', function(assert) {
  // BAD
  this.page.render(hbs`{{foo}}`);
  
  // GOOD
  this.render(hbs`{{foo}}`);
});
```

## Old finders

**ID**: ember-cli-page-object.old-finders

**Until**: 2.0.0

Using `findElement` and `findElementWithAssert` is deprecated. Please use `findOne` or `findMany` instead.

```js
import { findOne, findMany } from 'ember-cli-page-object/extend';

export default function isDisabled(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      return findOne(this, selector, options).disabled;
    }
  };
}

export default function count(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      return findMany(this, selector, options).length;
    }
  };
}
```
