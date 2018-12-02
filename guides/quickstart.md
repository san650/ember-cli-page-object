---
layout: page
title: Quickstart
---

{% raw %}

This is a short guide to get you started building powerful UI testing APIs using EmberCLI Page Object.

- [Basics](#basics)
- [Calculator](#calculator)
- [Pages](#pages)

## Components

The primary build block of page objects is a [component](./components). It consists of a [`scope`](./components#scopes), [`attributes`](./components#attributes), methods and nested components.

Let's [`create`](./api/create) a page object instance for a simple form:

__Example__

```html
<form class="search-form">
  <input type="search">
  <button>Search</button>
</form>
```

```js
import { create, triggerable } from 'ember-cli-page-object';

const searchForm = create({
  scope: '.search-form',

  text: { scope: 'input[type="search"]' },

  submit: triggerable('submit')
});
```

All the components are supplied with a set of [default attributes](./components#default-attributes). In many cases, you need only to define a component's `scope`, as seen with `datum` nested component here.

```js
  test('it renders', async function(assert) {
    await render(hbs`{{search-form text="initial text"}}`);

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

    await render(hbs`{{search-form onSubmit=(action search)}}`);

    await searchForm.datum.fillIn('new text');
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

## Calculator

Assume there is a simple calculator with a numpad, basic operator buttons, and a screen to display results.

Let's generate a page object component definition for it with a help of corresponding generator:

```bash
$ ember generate page-object-component quickstart-calculator

installing
  create tests/pages/components/quickstart-calculator.js
```

We can describe a calculator as follows:

```js
// your-app/tests/pages/components/quickstart-calculator.js
import {
  clickable,
  collection,
  triggerable,
  value
} from 'ember-cli-page-object';

export default {
  scope: 'form.quickstart-calculator',

  plus: clickable('button.plus'),

  equals: triggerable('submit'),

  value: value('[data-test-screen]'),

  digits: collection('.numpad > button'),
};
```

Here we've used a [collection](./api/collection) to describe a list of digit buttons.

The collection function's optional second argument is the definition for each item within the collection. When not supplied (as seen in this example), the item is composed of the default attributes.

Let's test it:

```js
// my-app/tests/components/quickstart-calculator-test.js

import { create } from 'ember-cli-page-object';
import QuickstartCalculator from 'my-app/tests/pages/components/quickstart-calculator';

const c = create(QuickstartCalculator);

module('QuickstartCalculator', // ...
  test('it works!', async function(assert) {
    await render(hbs`<QuickstartCalculator />`);

    await c.digits[1].click();
    await c.plus();
    await c.digits[2].click();
    await c.equals();

    assert.equal(c.value, 5);
  });
```

We can reuse this `quickstart-calculator` page object component to test any other template that includes a `<QuickstartCalculator />`.

If you noticed in the test, we directly rely on the digit button's ordering. For example, a zero button is rendered last in a typical calculator:

```js
  // click zero button
  await c.digits[9].click();
```

This approach is fragile, unintuitive, and detracts from the readability of our tests. Let's improve it by declaring a method for clicking a digit button by its value.

First, we have to normalize "0" to be the 10th button of the numpad, and then compensate for the collection's zero indexing by subtracting 1:

```js
const normalize = (d) => `${d}`.trim() === '0' ? 9 : d - 1;
```

Now let's add a `clickDigit` action into definition:

```js
export default {
  scope: 'form.quickstart-calculator',

  plus: clickable('button.plus'),

  equals: triggerable('submit'),

  value: value('[data-test-screen]'),

  digits: collection('.numpad > button'),

  async clickDigit(text) {
    await this.digits[normalize(text)].click();

    return this;
  }
}
```

We must return this (the page object's root node) to allow for further chaining of the page object's actions.

```js
// my-app/tests/components/quickstart-calculator-test.js

import { create } from 'ember-cli-page-object';
import QuickstartCalculator from 'my-app/tests/pages/components/quickstart-calculator';

const c = create(QuickstartCalculator);

module('QuickstartCalculator', // ...
  test('it just works', async function(assert) {
    await render(hbs`{{quickstart-calculator}}`);

    await c.clickDigit(2);
    await c.plus();
    await c.clickDigit(3);
    await c.equals();

    assert.equal(c.value, 5);
  });

  test('it works with chaining', async function(assert) {
    await render(hbs`{{quickstart-calculator}}`);

    await c
      .clickDigit(2)
      .plus()
      .clickDigit(3)
      .equals();

    assert.equal(c.value, 5);
  });
```

Our new page object encapsulates all the possible interactions we'll need when testing our calculator with an idiomatic API that abstracts away the necessary DOM traversal and interaction. No more littering our test with brittle CSS selectors that hamper readability!

## Pages

For comprehensive testing of our application, we must rely on more than testing individual components in isolation (ie acceptance testing). We can map each "page" in our app (route + template) to a `page-object`, composing various `page-object-component`s together to form a complete representation of page.

Let's take a look at how we might generate a page-object.

```
$ ember generate page-object my-page

installing
  create tests/pages/my-page.js
```

The generator created a file inside the directory `/tests/pages`. It allows to easier distinguish pages between components, which are located under `/tests/pages/components/`.

A generated page output looks like the following:

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

Suppose we have a calculator on the page:

```js
// my-app/tests/pages/my-page.js
import { create, visitable } from 'ember-cli-page-object';
import Calculator from 'my-app/tests/pages/components/quickstart-calculator';

export default create({
  visit: visitable('/'),

  calculator: Calculator
});
```

A simple application test using a `page-object` might look like:

```js
// my-app/tests/acceptance/my-page-test.js
import myPage from 'my-app/tests/pages/my-page';

module('My Page', // ...
  test('it renders a calculator', async function(assert) {
    await myPage.visit();

    assert.ok(myPage.calculator.isVisible);
  })
```

{% endraw %}
