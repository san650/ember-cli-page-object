---
layout: page
title: Quickstart
---

{% raw %}

This is a short guide to get you started building powerful testing APIs for UI using EmberCLI Page Object.

- [Basics](#basics)
- [Calculator](#calculator)
- [Pages](#pages)

## Basics

The primary building block in page objects is a [component](./components). It consists of a `scope`, attributes, methods and nested components.

Let's [`create`](./api/create) a page object instance for a simple form:

```js
import { create, triggerable } from 'ember-cli-page-object';

const myForm = create({
  scope: '.my-form',

  datum: { scope: '[data-test-datum]' },

  submit: triggerable('submit')
});
```

All components are supplied with a set of [default attributes](./components#default-attributes), so in many cases you just need to define a component `scope` in order to use it: 

```js
  test('it renders', async function(assert) {
    await render(hbs`{{my-form value="initial value"}}`);

    // checks that ".my-form" is displayed
    assert.ok(myForm.isVisible);

    // check an input value of ".my-form [data-test-datum]"
    assert.equal(myForm.datum.value, 'initial value');
  });
```

All the action attributes are asynchronous:

```js
  test('using actions', async function(assert) {
    let lastSaved;
    this.save = (data) => lastSaved = data;

    await render(hbs`{{my-form onSave=(action save)}}`);

    await myForm.datum.fillIn('new value');
    await myForm.submit();

    assert.deepEqual(lastSaved, {
      datum: 'new value'
    })
  });
```

In addition each action returns a chainable page object node which allows to chain further actions within a single statement. 

For example that's how 2 consequent action invocations look like without chaining:

```js
  await myForm.datum.fillIn('test')
  await myForm.datum.blur()
```

And that's how we achieve the same result with chaining: 

```js
  await myForm.datum
    .fillIn('test')
    .blur();
```

## Calculator

Assume there is a simple calculator with a numpad, basic operator buttons and a screen where we can see a result of calculation.

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

Collections can accept a definition as a second argument in order to describe a colletion item.

In our example it's sufficient to rely on a component with default attributes for digit buttons.

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

Now We have a working calculator page object component which we can use across tests.

However there is still some unwanted complexity here. In the test we directly rely on digits buttons ordering which is fragile and may lead to a confusion when working with a test.

For example, a zero button is rendered the last in a typical calculator:

```js
  // click zero button
  await c.digits[9].click();
```

Usually you don't want to keep in mind rules like that when dealing with test scenarios.

Let's improve it by declaring a method for clicking a digit button by its value.

First, we have to normalize "0" to be the 10th button of the numpad:

```js
const normalize = (d/*: number */) => `${d}`.trim() === '0' ? 9 : d - 1;
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

By returning `this` we allow a chaining context to remain a calculator's root object rather than a `digit` button nested page oject.

Now we have an easy way to interact with the form in tests:  

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

Now we have a pretty solid and easy to use calculator testing API.

We don't rely on any CSS selectors directly in our tests. We've also absorbed DOM layout complexity and exposed only functional properties of the component to the test.

All this makes a test suite easier to maintain and fun to implement!

## Pages

A web page is usually associated with a certain resource URL which is represented by some components hierarchy. Having an URL attribute makes testing of application pages a bit special.

Let's take a look on how the generated page-object page does look like:

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

The page is provided with a [`visitable`](./api/visitable) attribute to open associated web page.

You also might have noticed that rather than exporting a plain definition we export a page object instance which can be used in your tests right after the page is imported.

We can include any number of nested components, attributes or methods into the definition, the same as for regular component definitions.

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

That's how a minimal application test using a page object can look like:

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
