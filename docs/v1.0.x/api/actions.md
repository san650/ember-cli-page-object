---
layout: page
title: Actions
---

### Methods

- [clickOnText](#clickontext)
- [clickable](#clickable)
- [fillable](#fillable)
- [visitable](#visitable)

## clickOnText

[test-support/page-object/actions/click-on-text.js:100-116](https://github.com/san650/ember-cli-page-object/blob/b9a36f01a8b3d265c7a14aa6bac29e4260d08e8c/test-support/page-object/actions/click-on-text.js#L100-L116 "Source code on GitHub")

Clicks on an element containing specified text.

The element can either match a specified selector,
or be inside an element matching the specified selector.

**Parameters**

-   `selector` **string** CSS selector of the element in which to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope

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

// queries the DOM with selector '.scope fieldset:contains("Lorem"):last'
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

[test-support/page-object/actions/clickable.js:57-68](https://github.com/san650/ember-cli-page-object/blob/b9a36f01a8b3d265c7a14aa6bac29e4260d08e8c/test-support/page-object/actions/clickable.js#L57-L68 "Source code on GitHub")

Clicks elements matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element to click
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Ignore parent scope

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

[test-support/page-object/actions/fillable.js:67-78](https://github.com/san650/ember-cli-page-object/blob/b9a36f01a8b3d265c7a14aa6bac29e4260d08e8c/test-support/page-object/actions/fillable.js#L67-L78 "Source code on GitHub")

Fills in an input matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope

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

## visitable

[test-support/page-object/actions/visitable.js:81-97](https://github.com/san650/ember-cli-page-object/blob/b9a36f01a8b3d265c7a14aa6bac29e4260d08e8c/test-support/page-object/actions/visitable.js#L81-L97 "Source code on GitHub")

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
