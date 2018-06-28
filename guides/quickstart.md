---
layout: page
title: Quickstart
---

{% raw %}

* [Installation](#installation)
* [Creating a Component](#creating-a-component)
* [Creating a Page Object](#creating-a-page-object)

## Installation

```bash
$ ember install ember-cli-page-object
```

## Creating a Component

Suppose we have a very simple search form:

```html
<form class="hasError">
  <input type="search">

  <button>Search</button>
</form>
```

The form also supports `has-error` class when user does submit with an empty search text.

Let's generate a dummy component definition:

```bash
$ ember generate page-object-component quick-search

installing
  create tests/pages/components/quick-search.js
```

Now we can descibe the form as follows:

```js
// project-name/tests/pages/components/quick-search.js

import { hasClass } from 'ember-cli-page-object';

export default {
  scope: 'form',

  hasError: hasClass('has-error')

  text: {
    scope: 'input[type="search"]',
  },

  submit: {
    scope: 'button'
  }
};
```

As you can see we export a plain javascript object here. First we need to create a page object instance from this definition in your component test:

```js
// tests/integration/quick-search-test.js

import { create } from 'ember-cli-page-object';
import QuickSearch from 'project-name/tests/pages/components/quick-search';

const search = create(QuickSearch);
```

Finally we can test our form:

```js
test('it renders', async function(assert) {
  await render(`{{quick-search text="some"}}`);

  search.as(s => {
    assert.ok(s.isVisible);
    assert.equal(s.text.value, 'some');
    assert.equal(s.submitButton.text, 'Search');
  });
});

test('it requires text on submit', async function(assert) {
  await render(hbs`{{my-search}}`);

  await search.submitButton.click();

  assert.ok(search.hasError)
});
```

## Creating a Page Object

Now let's test a search page which includes a QuickSearch form from the previous example and a simple results list with a title and desciption for each result item:

```html
<section class="SearchPage">
  <form>
    <input type="search">

    <button>Search</button>
  </form>

  <ul>
    <li>
      <h5>Title...</h5>
      <p>Description here...</p>
    </li>
  </ul>
</section>
```

In application tests we use page objects. Page object is usually composed from a different components and `visit` method.

Let's generate a Search Page page object:

```bash
$ ember generate page-object search

installing
  create tests/pages/search.js
```

```js
// project-name/tests/pages/search.js

import {
  create,
  collection,
  visitable
} from 'ember-cli-page-object';

import Form from './components/quick-search';

export default create({
  visit: visitable('/search'),

  scope: '.SearchPage',

  form: Form,

  results: collection('ul li', {
    title: 'h5',
    description: 'p'
  }),

  // Let's also provide a shorhand for the search form submit
  async search(text) {
    await this.form.text.fillIn(text);

    await this.form.submit();
  }
})
```

In comparison to components which are plain JS definitions, page objects are ready to use instances.

It means can just import and use it in tests:

```js
import searchPage from 'project-name/tests/pages/search';

test('it searches', async function(assert) {
  this.items = this.server.createList('item-model', [{
    title: 'Awesome Title'
  }, {
    title: 'Another Title'
  }])

  await searchPage.visit();
  await searchPage.search('some');

  assert.equal(searchPage.results.length, 1);
  assert.equal(searchPage.results[0].title, 'Awesome Title');
});
```

{% endraw %}
