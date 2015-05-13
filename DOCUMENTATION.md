# Page Object

Table of content

* [Setup](#setup)
* [Predicates](#predicates)
  * [`.hasClass`](#hasclass)
  * [`.notHasClass`](#nothasclass)
  * [`.isVisible`](#isvisible)
  * [`.isHidden`](#ishidden)
* [Queries](#queries)
  * [`.attribute`](#attribute)
  * [`.count`](#count)
  * [`.text`](#text)
  * [`.value`](#value)
* [Actions](#actions)
  * [`.clickable`](#clickable)
  * [`.clickOnText`](#clickontext)
  * [`.fillable`](#fillable)
  * [`.visitable`](#visitable)
* [Components](#components)
  * [`.collection`](#collection)
  * [`.component`](#component)

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
  isImageHidden: PO.isVisible('.img')
});

assert.ok(page.isImageHidden(), 'Image is hidden');
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

### `.component`

Allows to group attributes togeather.

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

Note that if the plain object doesn't have attributes defined, the object is returned as is.
