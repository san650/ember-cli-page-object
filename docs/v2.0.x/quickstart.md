---
layout: page
title: Quickstart
---

{% raw %}

This is a short guide to get you started building powerful UI testing APIs using EmberCLI Page Object.

- [Basic Component](#basic-component)
- [Pages](#pages)

## Basic Component

The primary build block of page objects is a [component](./components). It consists of a [`scope`](./components#scopes), [`attributes`](./components#attributes), custom methods, and nested components.

Assume there is a simple `<SearchForm />` component with a text field and a submit button on it.

__Example__

```html
<form class="search-form">
  <input type="search">
  <button>Search</button>
</form>
```

Let's generate a page object component definition for it with the help of the corresponding generator:

```bash
$ ember generate page-object-component search-form

installing
  create tests/pages/components/search-form.js
```

We can describe the form as follows:

```js
// your-app/tests/pages/components/search-form.js
import { triggerable } from 'ember-cli-page-object';

export default {
  scope: '.search-form',

  text: { scope: 'input[type="search"]' },

  submit: triggerable('submit')
};
```

All the components are supplied with a set of [default attributes](./components#default-attributes). In many cases, you need only to define a component's `scope`, as seen with the `text` nested component here.

In order to use a component, you have to import its definition and pass it to the Page Object's `create` function:

```js
// my-app/tests/integration/components/search-form-test.js
import { create } from 'ember-cli-page-object';
import SearchForm from 'my-app/tests/pages/components/search-form';

const searchForm = create(SearchForm);

module('SearchForm', // ...
  test('it renders', async function(assert) {
    await render(hbs`<SearchForm @text="initial text" />`);

    // using the default `isVisible` attribute, checks that `.search-form` is displayed
    assert.ok(searchForm.isVisible);

    // using the default `value` attribute, check the input value of `.search-form input[type=`search"]"
    assert.equal(searchForm.text.value, 'initial text');
  });
```

All the action attributes are asynchronous:

```js
  test('using actions', async function(assert) {
    let lastSearched;
    this.search = (text) => lastSearched = text;

    await render(hbs`<SearchForm onSubmit={{action search}} />`);

    await searchForm.text.fillIn('new text');
    await searchForm.submit();

    assert.deepEqual(lastSearched,  'new text' )
  });
```

In addition, each action returns the invoked page object node, which allows for the chaining of subsequent actions.

For example. without chaining:

```js
  await searchForm.text.fillIn('test')
  await searchForm.text.blur()
```

And, the same result with chaining:

```js
  await searchForm.text
    .fillIn('test')
    .blur();
```

## Pages

For comprehensive testing of our application, we must rely on more than testing individual components in isolation (ie acceptance testing). We can map each "page" in our app (route + template) to a `page-object`, composing various `page-object-component`s together to form a complete representation of the page.

Suppose we have a search page in our application. Let's generate a page-object for it.

```bash
$ ember generate page-object search-page

installing
  create tests/pages/search-page.js
```

The generator created a file inside the directory `/tests/pages`. Using this directory allows us to more easily distinguish pages from components, which are located under `/tests/pages/components/`.

The generated page object looks like the following:

```js
// my-app/tests/pages/my-page.js
import { create, visitable } from 'ember-cli-page-object';

export default create({
  visit: visitable('/')
});
```

The page is provided with a [`visitable`](./api/visitable) attribute to navigate to the associated page in our app.

You also might have noticed that rather than exporting a plain definition, we export a page object instance, which can be used in your tests directly after the page is imported. 

We can include any number of nested components, attributes, or methods in the definition, just as we did for `page-object-component`s.

Let's update the page object as follows:

```js
// my-app/tests/pages/my-page.js
import { create, visitable, collection } from 'ember-cli-page-object';
import SearchForm from 'my-app/tests/pages/components/search-form';

export default create({
  visit: visitable('/'),

  results: collection('ol li article'),

  searchForm: SearchForm,

  /**
   * Note, we can also declare native methods on definitions,
   * in order to provide higher level APIs for tests
   */
  async search(text) {
    await this.searchForm.text.fillIn(text);
    await this.searchForm.submit();

    return this.results;
  }
});
```

A simple application test using a `page-object` might look like:

```js
// my-app/tests/acceptance/my-page-test.js
import myPage from 'my-app/tests/pages/my-page';

module('Search Page', // ...
  test('it works', async function(assert) {
    await myPage.visit();

    const results = await myPage.search('some');

    assert.equal(results.length, 1);
    assert.ok(results[0].contains('Awesome search result!'));
  })
```

{% endraw %}
