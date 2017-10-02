---
layout: page
title: Create
---

{% raw %}
### Methods

- [create](#create)

## create

[addon/-private/create.js:99-138](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/create.js#L99-L138 "Source code on GitHub")

Creates a new PageObject.

By default, the resulting PageObject will respond to:

* [click](/docs/v1.11.x/api/clickable)
* [clickOn](/docs/v1.11.x/api/click-on-text)
* [contains](/docs/v1.11.x/api/contains)
* [fillIn](/docs/v1.11.x/api/fillable)
* [isVisible](/docs/v1.11.x/api/is-visible)
* [isHidden](/docs/v1.11.x/api/is-hidden)
* [select](/docs/v1.11.x/api/selectable)
* [text](/docs/v1.11.x/api/text)

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
-   `definitionOrUrl`
-   `definitionOrOptions`
-   `optionsOrNothing`

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
assert.equal(page.value, 'my input value');

// clicks div#my-page
page.click();

// clicks button
page.clickOn('Press Me');

// fills an input
page.fillIn('name', 'John Doe');

// selects an option
page.select('country', 'Uruguay');
```

```javascript
Defining path

const usersPage = PageObject.create('/users');

// visits user page
usersPage.visit();

const userTasksPage = PageObject.create('/users/tasks', {
 tasks: collection({
   itemScope: '.tasks li',
   item: {}
 });
});

// get user's tasks
userTasksPage.visit();
userTasksPage.tasks().count
```

Returns **PageObject**
{% endraw %}
