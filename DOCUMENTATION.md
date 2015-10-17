# Page Object

Table of contents

* [Setup](#setup)
* [Predicates](#predicates)
  * [`.hasClass`](#hasclass)
  * [`.notHasClass`](#nothasclass)
  * [`.isVisible`](#isvisible)
  * [`.isHidden`](#ishidden)
  * [`.contains`](#contains)
* [Queries](#queries)
  * [`.attribute`](#attribute)
  * [`.count`](#count)
  * [`.text`](#text)
  * [`.value`](#value)
* [Actions](#actions)
  * [`.clickable`](#clickable)
  * [`.clickOnText`](#clickontext)
  * [`.fillable`](#fillable)
  * [`.selectable`](#selectable)
  * [`.visitable`](#visitable)
* [Components](#components)
  * [`.collection`](#collection)
  * [`.component`](#component)
  * [`.customHelper`](#customhelper)
* [Attribute options](#attribute-options)
  * [`scope`](#attribute-scope)
  * [`index`](#index)
* [Scopes](#scopes)

## Setup

You can import the PageObject object using the `import` construct as follows:

```js
import PO from '../page-object';
```

The previous example assumes that your test file is one level deep under
`tests/` folder. i.e. `tests/unit/my-unit-test.js`.


In order to create a new PageObject definition use the `.build` method.

```js
var page = PO.build({
  // page attributes
});
```

You can define attributes using any JavaScript construct

```js
var page = PO.build({
  title: function() {
    return $('.title').text();
  },

  text: 'A text'
});

assert.equal(page.title(), 'My title');
assert.equal(page.text, 'A text');
```

There are many special attributes you can use defined under the PO namespace
that simplify common patterns, i.e.

```js
var page = PO.build({
  title: PO.text('.title')
});
```

The following is a comprehensive documentation of the available `PO` attribute
helpers.

## Predicates

Test conditions on elements

### `.hasClass`

Returns `true` if the element has the css class.

Attribute signature

```js
PO.hasClass(cssClass, selector [, scope: ''])
```

Examples

```html
<img class="img is-active" src="...">
```

```js
var page = PO.build({
  isImageActive: PO.hasClass('is-active', '.img')
});

assert.ok(page.isImageActive(), 'Image is active');
```

### `.notHasClass`

Returns `true` if the element doesn't have the css class.

Attribute signature

```js
PO.notHasClass(cssClass, selector [, scope: ''])
```

Examples

```html
<img class="img is-active" src="...">
```

```js
var page = PO.build({
  isImageDeactivated: PO.notHasClass('is-active', '.img')
});

assert.ok(page.isImageDeactivated(), 'Image is not active');
```

### `.isVisible`

Returns `true` if the element exists and is visible.

Attribute signature

```js
PO.isVisible(selector [, scope: ''])
```

Examples

```html
<img class="img" src="...">
```

```js
var page = PO.build({
  isImageVisible: PO.isVisible('.img')
});

assert.ok(page.isImageVisible(), 'Image is visible');
```

### `.isHidden`

Returns `true` if the element doesn't exist or it exists and is hidden.

Attribute signature

```js
PO.isHidden(selector [, scope: ''])
```

Examples

```html
<img class="img" style="display:none" src="...">
```

```js
var page = PO.build({
  isImageHidden: PO.isHidden('.img')
});

assert.ok(page.isImageHidden(), 'Image is hidden');
```

### `.contains`

Returns `true` if the given text is found within element's text.

Attribute signature

```js
PO.contains(selector [, scope: ''])
```

Examples

```html
<h1> Page Title </h1>
```

```js
var page = PO.build({
  titleIncludes: contains('h1')
});

assert.ok(page.titleIncludes('Page'));
```

## Queries

Retrieve values from elements

### `.attribute`

Returns the element's attribute value.

Attribute signature

```js
PO.attribute(attributeName, selector [, scope: ''])
```

Examples

```html
<img class="img" alt="Logo" src="...">
```

```js
var page = PO.build({
  imageAlternateText: PO.attribute('alt', '.img')
});

assert.equal(page.imageAlternateText(), 'Logo');
```

### `.count`

Returns the count of elements that match the css selector.

Attribute signature

```js
PO.count(selector [, scope: ''])
```

Examples

```html
<img class="img" src="...">
<img class="img" src="...">
```

```js
var page = PO.build({
  imageCount: PO.count('.img')
});

assert.equal(page.imageCount(), 2);
```

### `.text`

Returns the inner text of the element. Note that whitespace from the beginning
and end of the string is removed for convenience.

Attribute signature

```js
PO.text(selector [, scope: ''])
```

Examples

```html
<h1>Page title</h1>
```

```js
var page = PO.build({
  title: PO.text('h1')
});

assert.equal(page.title(), 'Page title');
```

### `.value`

Returns the value of an input.

Attribute signature

```js
PO.value(selector [, scope: ''])
```

Examples

```html
<input id="name" value="John Doe" />
```

```js
var page = PO.build({
  name: PO.value('#name')
});

assert.equal(page.name(), 'John Doe');
```

## Actions

Encapsulates and extend `ember-testing` async helpers, supporting chaining and
other features.

### `.clickable`

Creates an action to click an element.

Attribute signature

```js
PO.clickable(selector [, scope: ''])
```

Examples

```html
<button id="submit">Send</button>
```

```js
var page = PO.build({
  submitForm: PO.clickable('#submit')
});

page.submitForm();

andThen(function() {
  // form was submitted
});
```

### `.clickOnText`

Creates an action to click on an element by text. The text is case sensitive.

Attribute signature

```js
PO.clickOnText(selector, [, scope: ''])
```

Examples

```html
<button class="btn">Create</button>
<button class="btn">Cancel</button>
```

```js
var page = PO.build({
  click: clickOnText('.btn')
});

page.click("Create");

andThen(function() {
  // ...
});

page.click("Cancel");

andThen(function() {
  // ...
});
```

> A string of text to look for. It's case sensitive.
> The text must have matching case to be selected.
> gwill match elements with the desired text block:

### `.fillable`

Fills an input.

Attribute signature

```js
PO.fillable(selector [, scope: ''])
```

Examples

```html
<input id="name" />
```

```js
var page = PO.build({
  name: PO.fillable('#name')
});

page.name('John Doe');

andThen(function() {
  // the input value is set
});
```

### `.selectable`

Selects an option.

Attribute signature

```js
PO.selectable(selector [, scope: ''])
```

Examples

```html
<select id="gender">
  <option>Male</options>
  <option>Female</options>
</select>
```

```js
var page = PO.build({
  selectGender: PO.selectable('#gender')
});

page.selectGender('Female');

andThen(function() {
  // the option is selected
});
```

### `.visitable`

Visits a page.

Attribute signature

```js
PO.visitable(routePath)
```

Examples

```js
var page = PO.build({
  visit: PO.visitable('/users')
});

page.visit();

andThen(function() {
  // the page is loaded
});
```

You can define dynamic segments in the path as follows

```js
var page = PO.build({
  visit: PO.visitable('/users/:user_id/comments/:comment_id')
});

page.visit({ user_id: 5, comment_id: 1 });

andThen(function() {
  assert.equal(currentURL(), '/users/5/comments/1');
});
```

You can also use query params when invoking the action as follows

```js
var page = PO.build({
  visit: PO.visitable('/users')
});

page.visit({}, { display: "collapsed" });

andThen(function() {
  assert.equal(currentURL(), '/users?display=collapsed');
});
```

### chaining

Actions can be chained.

Example

```html
<input id="name" />
<button id="submit">Send</button>
```

```js
var page = PO.build({
  visit: PO.visitable('/user/new'),
  submitForm: PO.clickable('#submit'),
  name: PO.fillable('#name')
});

page
  .visit()
  .name('John Doe')
  .submitForm();

andThen(function() {
  // form was submitted
});
```

## Components

### `.collection`

Allows to easily model a table or list of items.

Attribute signature

```js
PO.collection(definition)
```

The collection definition has the following structure

```js
{
  itemScope: '', // css selector

  item: {
    // item attributes
  },

  // collection attributes
}
```

The attributes defined in the `item` object are scoped using the `itemScope`
selector. The attributes defined outside the `item` object are available at
collection scope.

Examples

```html
<table id="users">
  <caption>The list of users</caption>
  <tr>
    <td>Jane</td>
    <td>Doe</td>
  </tr>
  <tr>
    <td>John</td>
    <td>Doe</td>
  </tr>
</table>
```

```js
var page = PO.build({
  visit: PO.visitable('/users'),

  users: PO.collection({
    itemScope: '#users tr',

    item: {
      firstName: PO.text('td:nth-of-type(1)'),
      lastName: PO.text('td:nth-of-type(2)')
    },

    caption: PO.text('#users caption')
  })
});

test('show all users', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(login.users().caption(), 'The list of users');
    assert.equal(login.users().count(), 2); // count attribute is added for free
    assert.equal(login.users(1).firstName(), 'Jane');
    assert.equal(login.users(1).lastName(), 'Doe');
    assert.equal(login.users(2).firstName(), 'John');
    assert.equal(login.users(2).lastName(), 'Doe');
  });
});
```

**Note that ember-cli-page-object collections are 1-based arrays.**

### `.component`

Allows to group attributes together.

Attribute signature

```js
PO.component(definition)
```

Examples

```html
<h1>New user</h1>
<form>
  <input id="firstName" placeholder="First name">
  <input id="lastName" placeholder="Last name">
  <button>Create</button>
</form>
```

```js
var page = PO.build({
  visit: PO.visitable('/user/create'),
  title: PO.text('h1'),

  form: PO.component({
    firstName: PO.fillable('#firstName'),
    lastName: PO.fillable('#lastName'),
    submit: PO.clickable('button')
  })
});

page.visit();

andThen(function() {
  assert.equal(page.title(), 'New user');
});

page
  .form()
  .firstName('John')
  .lastName('Doe')
  .submit();

andThen(function() {
  // the form was submitted
});
```

You can define components implicity by creating a plain object with attributes on it

```js
var page = PO.build({
  visit: PO.visitable('/user/create'),
  title: PO.text('h1'),

  form: {
    firstName: PO.fillable('#firstName'),
    lastName: PO.fillable('#lastName'),
    submit: PO.clickable('button')
  }
});
```

Note that if the plain object doesn't have attributes defined, the object is
returned as is.

### `.customHelper`

Allows to define reusable helpers using information of the surrounding context.

```js
PO.customHelper(function(selector, options) {
  // user magic goes here
  return value;
});
```

There are three different types of custom helpers and are differentiated by the
return value. You can define custom helpers that return:

1. A _basic type_ value
2. A _plain object_ value
3. A _function_ value

Given this HTML snippet, the following is an example of each type of custom
helpers

```html
<form>
  <label class="has-error">
    User name
    <input id="userName" />
  </label>
</form>
```

#### 1. Basic type value

This type of custom helper is useful to return the result of a calculation, for
example the result of a jQuery expression.

```js
var disabled = customHelper(function(selector, options) {
  return $(selector).prop('disabled');
});

var page = PageObject.build({
  userName: {
    disabled: disabled('#userName')
  }
});

assert.ok(!page.userName().disabled(), 'user name input is not disabled');
```

As you can see the jQuery expression is returned.

#### 2. Plain Object

This is very similar to a `component`. The difference with components is that we
can do calculations or use custom options before returning the component.

```js
var input = customHelper(function(selector, options) {
  return {
    value: value(selector),
    hasError: function() {
      return $(selector).parent().hasClass('has-error');
    }
  };
});

var page = PageObject.build({
  scope: 'form',
  userName: input('#userName')
});

assert.ok(page.userName().hasError(), 'user name has errors');
```

As you can see the returned plain object is converted to a component.

#### 3. Functions

The main difference with the previous custom helpers is that the returned
functions receive invocation parameters. This is most useful when creating
custom actions that receives options when invoked (like `fillIn` helper).

```js
/* global click */
var clickManyTimes = customHelper(function(selector, options) {
  return function(numberOfTimes) {
    click(selector);

    for(let i = 0; i < numberOfTimes - 1; i++) {
      click(selector);
    }
  };
});

var page = PageObject.build({
  clickAgeSelector: clickManyTimes('#ageSelector .spinner-button'),
  ageValue: value('#ageSelector input')
});

page.visit().clickOnAgeSelector(18 /* times*/);

andThen(function() {
  assert.equal(page.ageValue(), 18, 'User is 18 years old');
});
```

We can see that our `clickOnAgeSelector` takes one parameter that's used by the
returned function.

#### Custom options

Custom helpers can receive custom options, here's an example of this:

```js
var prop = customHelper(function(selector, options) {
  return $(selector).prop(options.name);
});

var page = PageObject.build({
  userName: {
    disabled: prop('#userName', { name: 'disabled' })
  }
});

assert.ok(!page.userName().disabled(), 'user name input is not disabled');
```

## Attribute options

A set of options can be passed as parameters when defining attributes.

### Attribute `scope`

The `scope` option can be used to override the page's `scope` configuration.

Given the following HTML

```html
<div class="article">
  <p>Lorem ipsum dolor</p>
</div>
<div class="footer">
  <p>Copyright 2015 - Acme Inc.</p>
</p>
```

the following configuration will match the footer element

```js
var page = PO.build({
  scope: '.article',

  textBody: PO.text('p'),

  copyrightNotice: PO.text('p', { scope: '.footer' })
});

andThen(function() {
  assert.equal(page.copyrightNotice(), 'Copyright 2015 - Acme Inc.');
});
```

### `index`

The `index` option can be used to reduce the set of matched elements to the one
at the specified index.

Given the following HTML

```html
<span>Lorem</span>
<span>ipsum</span>
<span>dolor</span>
```

the following configuration will match the second `span` element

```js
var page = PO.build({
  word: PO.text('span', { index: 2 })
});

andThen(function() {
  assert.equal(page.word(), 'ipsum'); // => ok
});
```

## Scopes

The `scope` attribute can be used to reduce the set of matched elements to the
ones enclosed by the given selector.

Given the following HTML

```html
<div class="article">
  <p>Lorem ipsum dolor</p>
</div>
<div class="footer">
  <p>Copyright 2015 - Acme Inc.</p>
</div>
```

the following configuration will match the article paragraph element

```js
var page = PO.build({
  scope: '.article',

  textBody: PO.text('p'),
});

andThen(function() {
  assert.equal(page.textBody(), 'Lorem ipsum dolor.');
});
```

The attribute's selector can be omited when the scope matches the element we
want to use.

Given the following HTML

```html
<form>
  <input id="userName" value="a value" />
  <button>Submit</button>
</form>
```

We can define several attributes on the same `input` element as follows

```js
var page = PO.build({
  input: {
    scope: '#userName',

    hasError: hasClass('has-error'),
    value: value(),
    fillIn: fillable()
  },

  submit: clickable('button')
});

page
  .input()
  .fillIn('an invalid value');

page.submit();

andThen(function() {
  assert.ok(page.input().hasError(), 'Input has an error');
});
```

### `collection` inherits parent scope by default

```html
<div class="todo">
  <input type="text" value="invalid value" class="error" placeholder="To do..." />
  <input type="text" placeholder="To do..." />
  <input type="text" placeholder="To do..." />
  <input type="text" placeholder="To do..." />

  <button>Create</button>
</div>
```

```js
var page = PageObject.build({
  scope: '.todo',

  todos: collection({
    itemScope: 'input',

    item: {
      value: value(),
      hasError: hasClass('error')
    },

    create: clickable('button')
  });
});
```

|  | translates to |
| ------ | -------- |
| `page.todos().create()` | `click('.todo button')` |
| `page.todos(1).value()` | `find('.todo input:eq(0)').val()` |

You can reset parent scope by setting the `scope` attribute on the collection declaration.

```js
var page = PageObject.build({
  scope: '.todo',

  todos: collection({
    scope: '',
    itemScope: 'input',

    item: {
      value: value(),
      hasError: hasClass('error')
    },

    create: clickable('button')
  });
});
```

| | translates to |
| ------ | -------- |
| `page.todos().create()` | `click('button')` |
| `page.todos(1).value()` | `find('input:eq(0)').val()` |

`itemScope` is inherited as default scope on components defined inside the item object.

```html
<ul class="todos">
  <li>
    <span>To do</span>
    <input value="" />
  </li>
  ...
</ul>
```

```js
var page = PageObject.build({
  scope: '.todos',

  todos: collection({
    itemScope: 'li',

    item: {
      label: text('span'),
      input: {
        value: value('input')
      }
    }
  });
});
```

| | translates to |
| ------ | ------------ |
| `page.todos(1).input().value()` | `find('.todos li:nth-of-child(1) input).val()` |

### `component` inherits parent scope by default

```html
<div class="search">
  <input placeholder="Search..." />
  <button>Search</button>
</div>
```

```js
var page = PageObject.build({
  search: {
    scope: '.search',

    input: {
      fillIn: fillable('input'),
      value: value('input')
    }
  }
});
```

| | translates |
| ------- | -------- |
| `page.search().input().value()` | `find('.search input').val()` |

You can reset parent scope by setting the `scope` attribute on the component declaration.

```js
var page = PageObject.build({
  search: {
    scope: '.search',

    input: {
      scope: 'input',

      fillIn: fillable(),
      value: value()
    }
  }
});
```

| | translates |
| ------- | -------- |
| `page.search().input().value()` | `find('input').val()` |
