---
layout: page
title: Create
---

{% raw %}
### Methods

- [create](#create)

## create

[addon/create.js:113-133](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/create.js#L113-L133 "Source code on GitHub")

Creates a new PageObject.

By default, the resulting PageObject will respond to:

-   **Actions**: click, clickOn
-   **Predicates**: contains, isHidden, isVisible
-   **Queries**: text

`definition` can include a key `context`, which is an
optional integration test `this` context.

If a context is passed, it is used by actions, queries, etc.,
as the `this` in `this.$()`.

If no context is passed, the global Ember acceptence test
helpers are used.

**Parameters**

-   `definition` **Object** PageObject definition
    -   `definition.context` **[Object]** A test's `this` context
-   `options` **Object** [private] Ceibo options. Do not use!

**Examples**

```javascript
// <div class="title">My title</div>

import PageObject, { text } from 'ember-cli-page-object';

const page = PageObject.create({
  title: text('.title')
});

assert.equal(page.title, 'My title');
```

```javascript
// <div id="my-page">
//   My super text
//   <button>Press Me</button>
// </div>

const page = PageObject.create({
  scope: '#my-page'
});

assert.equal(page.text, 'My super text');
assert.ok(page.contains('super'));
assert.ok(page.isVisible);
assert.notOk(page.isHidden);

// clicks div#my-page
page.click();

// clicks button
page.clickOn('Press Me');
```

Returns **PageObject** 
{% endraw %}