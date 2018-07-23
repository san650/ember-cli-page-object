---
layout: page
title: Quickstart
---

{% raw %}

This is a short guide to get you started testing your applications with EmberCLI Page Object. 

 - [Prelude](#prelude)
 - [Component](#component)
 - [Collection](#collection)
 - [Page Object](#page-object)

## Prelude

First let's consider a search page with the following markup:

```html
<section class="SearchPage">

  <!-- {{search-form text=this.text}} -->
  <form>
    <input type="search">

    <button>Search</button>
  </form>

  <!-- {{search-results items=this.items}} -->
  <ul>
    <li>
      <h5>Title #1</h5>
      <p>Description here...</p>
    </li>
    <li>
      <h5>Title #2</h5>
      <p>Description here...</p>
    </li>
  </ul>

</section>
```

Here is how an application test for this page might look:

```js
test('it searches', async function(assert) {
  this.server.createList('my-model', [
    { title: 'Awesome Title' },
    { title: 'Other Title' }
  ]);

  await visit('/search');
  await fillIn('.SearchPage form [type=search]', 'some');
  await click('.SearchPage form button');

  assert.dom('.SearchPage ul li').exists({ count: 1 });
  assert.dom('.SearchPage ul li h5').hasText('Awesome Title');
});
```

Whilst the markup is pretty simple we can see a mix of `search-form` and `search-results` components with their own DOM structures and interaction specifics which may make maintainability of your tests a challenge when it comes to a more complex pages or large test suites. 

With page objects you can break a complex UI into a smaller manageable components with nice APIs and composability capabilities.

## Component

First let's see how to define a `search-form` with a page object component.

```html
<!-- search-form -->

<form>
  <input type="search">

  <button>Search</button>
</form>
```

To generate component definitions you can use a corresponding component generator:

```bash
$ ember generate page-object-component search-form

installing
  create tests/pages/components/search-form.js
```

With page objects, `search-form` component can be described as follows:

```js
// project-name/tests/pages/components/search-form.js

import { clickable } from 'ember-cli-page-object';

export default {
  scope: 'form',

  text: {
    scope: 'input[type="search"]',
  },

  submit: clickable('button')
};
```

A plain object with a `scope` attribute provided is a component definition. It means the `text` attribute does also contain a component definition.

Let's see how to use our fresh definition in component tests:

```js
// tests/integration/search-form-test.js

import { create } from 'ember-cli-page-object';
import SearchForm from 'project-name/tests/pages/components/search-form';

// Create a component from the definition
const search = create(SearchForm);

test('it renders', async function(assert) {
  await render(`{{search-form}}`);

  // "isVisible" is a default component attribute
  assert.ok(search.isVisible);
});

test('it renders with a search text', async function(assert) {
  await render(`{{search-form text="some"}}`);

  // "value" is a default component attribute
  assert.equal(search.text.value, 'some');
});

test('it submits search text', async function(assert) {
  this.onSubmit = (text) => {
    assert.equal(text, 'Search Text');
  }

  await render(hbs`{{my-search onSubmit=(action onSubmit)}}`);

  // "fillIn" is a default component action
  await search.text.fillIn('Search Text');

  await search.submit();
});
```

## Collection

Sometimes we have a component rendered multiple times on the page. For example, let's take a look at the search results block: 

```html
<!-- search-results -->

<ul>
  <li>
    <h5>Title #1</h5>
    <p>Description here...</p>
  </li>
  <li>
    <h5>Title #2</h5>
    <p>Description here...</p>
  </li>
</ul>
```

The `li` is a component which is rendered iteratively.

For such cases EmberCLI Page Object provides us with a `collection` helper to describe component collections in the DOM.

Let's create a `search-item` component definition in order to use it with a search results collection in the final application test.

```bash
$ ember generate page-object-component search-item
```

```js
// project-name/tests/pages/components/search-item.js
export default {
  scope: 'li',

  title: {
    scope: 'h5'
  },

  description: {
    scope: 'p'
  }
}
```

Here is an example how we can define a collection:

```js
import { create, collection } from 'ember-cli-page-object';
import SearchItem from 'project-name/tests/pages/components/search-item';

const page = create({
  // at the first argument we specify a path to collection item component
  results: collection('ul>li', SearchItem)
});
```

And few collection instance usage examples:

```js
// ...
assert.equals(page.results.length, 2);
assert.equals(page.results[0].title.text, 'Title #1');
assert.equals(page.results[0].filter(i => i.contains('Description here...')).length, 2);
```

## Page Object

Page Object is a high level container for a smaller components, actions and attributes which is supposed to be a complete testing interface for a given page in your application tests.

Let's generate a `search` page object:

```bash
$ ember generate page-object search

installing
  create tests/pages/search.js
```

It would produce something like the following:

```js
// project-name/tests/pages/search.js
import {
  create,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/')
});
```

You may have noticed few page object differences with a component:

 - It has a `visit` method.
 - It is exported as a ready to use instance, so we don't have to deal with `create` in our application tests.

Now let's update it to include a `search-form` and search results collection with a `search-item` component we've implemented before. It should also refer to a valid `scope` and URL to `visit`:

```js
// project-name/tests/pages/search.js

import {
  create,
  collection,
  visitable
} from 'ember-cli-page-object';

import Form from './components/search-form';
import SearchItem from './components/search-item';

export default create({
  scope: '.SearchPage',

  visit: visitable('/search'),

  form: Form,

  results: collection('ul>li', SearchItem),

  // Let's also provide a convenient shorhand for a search action
  async search(text) {
    await this.form.text.fillIn(text);

    await this.form.submit();
  }
})
```

And we are ready to re-write initial application test with a page object:

```js
import searchPage from 'project-name/tests/pages/search';
// ...

test('it searches', async function(assert) {
  this.server.createList('my-model', [
    { title: 'Awesome Title' },
    { title: 'Other Title' }
  ]);

  await searchPage
    .visit()
    .search('some');

  const { results } = searchPage;

  assert.equal(results.length, 1);
  assert.equal(results[0].title, 'Awesome Title');
});
```

As you can see we don't deal with any CSS selectors in the tests anymore. This means if the markup is changed eventually we just need to update an appropriate page object declaration in a single place.

Also we have encapsulated complex actions like `search()` inside the page object definition. So we have a convenient and easy to remember API to test application.

{% endraw %}
