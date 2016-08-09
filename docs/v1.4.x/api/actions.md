---
layout: api
title: Actions
---

{% raw %}
### Methods

- [clickOnText](#clickontext)
- [clickable](#clickable)
- [fillable](#fillable)
- [selectable](#selectable)
- [triggerable](#triggerable)
- [visitable](#visitable)

## clickOnText

[addon/actions/click-on-text.js:125-143](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/actions/click-on-text.js#L125-L143 "Source code on GitHub")

Clicks on an element containing specified text.

The element can either match a specified selector,
or be inside an element matching the specified selector.

**Parameters**

-   `selector` **string** CSS selector of the element in which to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.visible` **boolean** Make the action to raise an error if the element is not visible
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.testContainer` **String** Context where to search elements in the DOM

**Examples**

```javascript
// <fieldset>
//  <button>Lorem</button>
//  <button>Ipsum</button>
// </fieldset>

const page = PageObject.create({
  clickOnFieldset: PageObject.clickOnText('fieldset'),
  clickOnButton: PageObject.clickOnText('button')
});

// queries the DOM with selector 'fieldset :contains("Lorem"):last'
page.clickOnFieldset('Lorem');

// queries the DOM with selector 'button:contains("Ipsum")'
page.clickOnButton('Ipsum');
```

```javascript
// <div class="scope">
//   <fieldset>
//    <button>Lorem</button>
//    <button>Ipsum</button>
//   </fieldset>
// </div>

const page = PageObject.create({
  clickOnFieldset: PageObject.clickOnText('fieldset', { scope: '.scope' }),
  clickOnButton: PageObject.clickOnText('button', { scope: '.scope' })
});

// queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
page.clickOnFieldset('Lorem');

// queries the DOM with selector '.scope button:contains("Ipsum")'
page.clickOnButton('Ipsum');
```

```javascript
// <div class="scope">
//   <fieldset>
//    <button>Lorem</button>
//    <button>Ipsum</button>
//   </fieldset>
// </div>

const page = PageObject.create({
  scope: '.scope',
  clickOnFieldset: PageObject.clickOnText('fieldset'),
  clickOnButton: PageObject.clickOnText('button')
});

// queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
page.clickOnFieldset('Lorem');

// queries the DOM with selector '.scope button:contains("Ipsum")'
page.clickOnButton('Ipsum');
```

Returns **Descriptor** 

## clickable

[addon/actions/clickable.js:79-97](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/actions/clickable.js#L79-L97 "Source code on GitHub")

Clicks elements matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element to click
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.visible` **boolean** Make the action to raise an error if the element is not visible
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **String** Context where to search elements in the DOM

**Examples**

```javascript
// <button class="continue">Continue<button>
// <button>Cancel</button>

const page = PageObject.create({
  continue: clickable('button.continue')
});

// clicks on element with selector 'button.continue'
page.continue();
```

```javascript
// <div class="scope">
//   <button>Continue<button>
// </div>
// <button>Cancel</button>

const page = PageObject.create({
  continue: clickable('button.continue', { scope: '.scope' })
});

// clicks on element with selector '.scope button.continue'
page.continue();
```

```javascript
// <div class="scope">
//   <button>Continue<button>
// </div>
// <button>Cancel</button>

const page = PageObject.create({
  scope: '.scope',
  continue: clickable('button.continue')
});

// clicks on element with selector '.scope button.continue'
page.continue();
```

Returns **Descriptor** 

## fillable

[addon/actions/fillable.js:116-134](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/actions/fillable.js#L116-L134 "Source code on GitHub")

Fills in an input matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.testContainer` **String** Context where to search elements in the DOM

**Examples**

```javascript
// <input value="">

const page = PageObject.create({
  fillIn: PageObject.fillable('input')
});

// result: <input value="John Doe">
page.fillIn('John Doe');
```

```javascript
// <div class="name">
//   <input value="">
// </div>
// <div class="last-name">
//   <input value= "">
// </div>

const page = PageObject.create({
  fillInName: PageObject.fillable('input', { scope: '.name' })
});

page.fillInName('John Doe');

// result
// <div class="name">
//   <input value="John Doe">
// </div>
```

```javascript
// <div class="name">
//   <input value="">
// </div>
// <div class="last-name">
//   <input value= "">
// </div>

const page = PageObject.create({
  scope: 'name',
  fillInName: PageObject.fillable('input')
});

page.fillInName('John Doe');

// result
// <div class="name">
//   <input value="John Doe">
// </div>
```

Returns **Descriptor** 

## selectable

[addon/actions/fillable.js:116-134](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/actions/fillable.js#L116-L134 "Source code on GitHub")

Alias for `fillable`, which works for inputs and HTML select menus.

[See `fillable` for usage examples.](#fillable)

**Parameters**

-   `selector` **string** CSS selector of the element to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.testContainer` **String** Context where to search elements in the DOM

Returns **Descriptor** 

## triggerable

[addon/actions/triggerable.js:96-114](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/actions/triggerable.js#L96-L114 "Source code on GitHub")

Triggers event on element matched by selector.

**Parameters**

-   `event` **string** Event to be triggered
-   `selector` **string** CSS selector of the element on which the event will be triggered
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **String** Context where to search elements in the DOM
    -   `options.eventProperties` **String** Event properties that will be passed to trigger function

**Examples**

```javascript
// <input class="name">
// <input class="email">

const page = PageObject.create({
  focus: triggerable('focus', '.name')
});

// focuses on element with selector '.name'
page.focus();
```

```javascript
// <input class="name">
// <input class="email">

const page = PageObject.create({
  enter: triggerable('keypress', '.name', { eventProperties: { keyCode: 13 } })
});

// triggers keypress using enter key on element with selector '.name'
page.enter();
```

```javascript
// <div class="scope">
//   <input class="name">
// </div>
// <input class="email">

const page = PageObject.create({
  focus: triggerable('focus', '.name', { scope: '.scope' })
});

// focuses on element with selector '.scope .name'
page.focus();
```

```javascript
// <div class="scope">
//   <input class="name">
// </div>
// <input class="email">

const page = PageObject.create({
  scope: '.scope',
  focus: triggerable('focus', '.name')
});

// clicks on element with selector '.scope button.continue'
page.focus();
```

Returns **Descriptor** 

## visitable

[addon/actions/visitable.js:82-98](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/actions/visitable.js#L82-L98 "Source code on GitHub")

Loads a given route.

The resulting descriptor can be called with dynamic segments and parameters.

**Parameters**

-   `path` **string** Full path of the route to visit

**Examples**

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users')
});

// visits '/users'
page.visit();
```

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users/:user_id')
});

// visits '/users/10'
page.visit({ user_id: 10 });
```

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users')
});

// visits '/users?name=john'
page.visit({ name: 'john' });
```

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users/:user_id')
});

// visits '/users/1?name=john'
page.visit({ user_id: 1, name: 'john' });
```

Returns **Descriptor** 
{% endraw %}
