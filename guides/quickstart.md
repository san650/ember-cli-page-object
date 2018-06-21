---
layout: page
title: Quickstart
---

{% raw %}

* [Components](#components)
* [Properties](#properties)
* [Collections](#collections)
* [Application Tests](#application-tests)
* [moduleFor test helpers](#moduleFor-test-helpers)


## Components

Components are the main building blocks in the EmberCLI Page Object. You can create one by running a component generator:

```bash
$ ember generate page-object-component search-form

installing
  create tests/pages/components/search-form.js
```

The only required component option is a css `scope`:

```js
// project-name/tests/pages/components/search-form.js

export default {
  scope: 'form.SearchForm',

  field: {
    scope: '[data-test-search-field]',
    
    input: {
      scope: 'input'
    },
  },

  submitButton: {
    scope: 'button'
  }
}
```

Scopes allows us to query a DOM via Page Object interface. Right after a component creation you can access a set of actions and properties provided by [default](./api/components#default-attributes).

```js
import { create } from 'ember-cli-page-object';
import SearchForm from 'project-name/tests/pages/components/search-form';

const searchForm = create(SearchForm);

test('it submits', async function(assert) {
  assert.expect(2);

  this.onSubmit = function(searchText) {
    assert.equal(searchText, 'search text')
  }

  await render(`{{search-form onSubmit=(action this.onSubmit)}}`);

  assert.ok(searchForm.isVisible);

  await searchForm.field.input.fillIn('search text');
  await searchForm.submitButton.click();
});
```

## Properties

Component API can be extended with a rich set of properties and actions. By default all the properties and actions inherit a parent component `scope` but you can specify a custom `scope` for it.

```js
import {
  attribute,
  fillable,
  clickable,
  hasClass
} from 'ember-cli-page-object';

export default {
  scope: 'form.SearchForm',
  
  field: {
    scope: '[data-test-search-field]',
    
    fillIn: fillable('input'),

    isFocused: hasClass('has-focus')

    isDisabled: attribute('disabled')
  },

  submit: clickable('button')
}
```

Then the previous test can be re-written as:

```js
test('it submits', async function(assert) {
  assert.expect(2);
  this.onSubmit = function(searchText) {
    assert.equal(searchText, 'search text')
  }

  await render(`{{search-form onSubmit=(action this.onSubmit)}}`);

  assert.ok(searchForm.isVisible);

  // Fill in "form.SearchForm [data-test-search-field] input" element
  await searchForm.field.fillIn('search text');

  // click "form.SearchForm button" element
  await searchForm.submit();

});
```

## Collections


In order to describe a List of components `collection` should be used:

```js
// project-name/tests/pages/components/awesome-list.js

import { collection } from 'ember-cli-page-object';

export default {
  scope: '.AwesomeList',

  items: collection('.AwesomeList-item', {
    title: {
      scope: '.AwesomeItem-title'
    },

    badges: collection('ul.AwesomeBadges li'),

    updatedAt: {
      scope: '.AwesomeItem-lastUpdated'
    }
  })
}
```

EmberCLI Page Object collections behave similar to usual JS arrays:

```js
import { create } from 'ember-cli-page-object';
import AwesomeList from 'project-name/tests/pages/components/awesome-list';

const awesomeForm = create(AwesomeList);

test('it renders', async function(assert) {
  this.items = [
    await run(() => this.store.createRecord('awesome-item', {
      title: 'Some title'
    }))
  ];

  await render(`{{awesome-list items=this.items}}`);

  assert.equal(awesomeList.items.length, 1);
  assert.equal(awesomeList.items[0].title.text, 'Some title');
});
```

## Application Tests

Application tests are not much different from the component tests. The only difference from the EmberCLI Page Object perpective is an availability of a visitable property.

Let's generate a page object containing our `SearchForm` and `AwesomeList` components with an ability to visit a page in the application tests mode:

```bash
$ ember generate page-object search-page

installing
  create tests/pages/search-page.js
```

```js
// project-name/tests/pages/search-page.js

import { create, visitable } from 'ember-cli-page-object';

import SearchForm from './components/search-form';
import AwesomeList from './components/awesome-list';

export default create({
  visit: visitable('/search'),

  scope: '.SearchPage',

  form: SearchForm,

  list: AwesomeList,

  // we can also express a sequence of actions or queries with page object methods
  search(text) {
    await this.form.field.fillIn(text);

    await this.form.submit();
  }
})
```

Now let's write our application test:

```js
import searchPage from 'project-name/tests/pages/search-page';

test('it searches', async function(assert) {
  this.items = this.server.createList('awesome-item', [{
    title: 'Some title'
  }, {
    title: 'Some text'
  }])

  await searchPage.visit();
  await searchPage.search('text');

  assert.equal(searchPage.list.length, 1);
  assert.equal(searchPage.list[0].title, 'Some text');
});
```

## moduleFor test helpers

In general EmberCLI Page Object definitions can be used accross the different test types and different test-helpers implementations without any page object definitions changes required.
However there is a caveat with a `moduleForComponent`. In order to instruct EmberCLI Page Object to enable `moduleForComponent` mode you should use `setupContext` on your page object:

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import form from 'project-name/tests/pages/components/search-form';

moduleForComponent('AwesomeList', 'Integration | AwesomeList', {
  integration: true,

  beforeEach() {
    page.setContext(this);
  },

  afterEach() {
    page.removeContext();
  }
});


test('it renders', function(assert) {
  this.items = [
    // @todo: check if it's working
    this.store.createRecord('awesome-item', {
      title: 'Some title'
    })
  ];

  render(`{{awesome-list items=this.items}}`);

  assert.equal(awesomeList.items.length, 1);
  assert.equal(awesomeList.items[0].title.text, 'Some title');
}

```

{% endraw %}
