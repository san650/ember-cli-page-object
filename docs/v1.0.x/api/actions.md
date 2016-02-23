---
layout: page
title: Actions
---

- [clickOnText](#clickontext)
- [clickable](#clickable)
- [fillable](#fillable)
- [visitable](#visitable)

## clickOnText

[test-support/page-object/actions/click-on-text.js:99-115](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/actions/click-on-text.js#L99-L115 "Source code on GitHub")

Clicks on element that contains text within the element specified by selector

The element to be clicked can be the same as specified by selector

**Parameters**

-   `selector` **string** CSS selector of the element to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope

**Examples**

```javascript
// <fieldset>
//  <button>Lorem</button>
//  <button>Ipsum</button>
// </fieldset>

var page = PageObject.create({
  clickOnFieldset: PageObject.clickOnText('fieldset'),
  clickOnButton: PageObject.clickOnText('button')
});

// queries the DOM with selector 'fieldset :contains("Lorem"):last'
page.clickOnFieldset('Lorem');

// queries the DOM with selector 'button:contains("Lorem")'
page.clickOnButton('Ipsum');
```

```javascript
// <div class="scope">
//   <fieldset>
//    <button>Lorem</button>
//    <button>Ipsum</button>
//   </fieldset>
// </div>

var page = PageObject.create({
  clickOnFieldset: PageObject.clickOnText('fieldset', { scope: '.scope' }),
  clickOnButton: PageObject.clickOnText('button', { scope: '.scope' })
});

// queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
page.clickOnFieldset('Lorem');

// queries the DOM with selector '.scope button:contains("Lorem")'
page.clickOnButton('Ipsum');
```

```javascript
// <div class="scope">
//   <fieldset>
//    <button>Lorem</button>
//    <button>Ipsum</button>
//   </fieldset>
// </div>

var page = PageObject.create({
  scope: '.scope',
  clickOnFieldset: PageObject.clickOnText('fieldset'),
  clickOnButton: PageObject.clickOnText('button')
});

// queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
page.clickOnFieldset('Lorem');

// queries the DOM with selector '.scope button:contains("Lorem")'
page.clickOnButton('Ipsum');
```

Returns **Descriptor** 

## clickable

[test-support/page-object/actions/clickable.js:58-69](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/actions/clickable.js#L58-L69 "Source code on GitHub")

Clicks element matched by selector

**Parameters**

-   `selector` **string** CSS selector of the element to click
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Ignore parent scope

**Examples**

```javascript
// <button class="continue">Continue<button>
// <button>Cancel</button>

var page = PageObject.create({
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

var page = PageObject.create({
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

var page = PageObject.create({
  scope: '.scope',
  continue: clickable('button.continue')
});

// clicks on element with selector '.scope button.continue'
page.continue();
```

Returns **Descriptor** 

## fillable

[test-support/page-object/actions/fillable.js:67-78](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/actions/fillable.js#L67-L78 "Source code on GitHub")

Fills an input matched by selector

**Parameters**

-   `selector` **string** CSS selector of the element to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope

**Examples**

```javascript
// <input value="">

var page = PageObject.create({
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

var page = PageObject.create({
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

var page = PageObject.create({
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

[test-support/page-object/actions/visitable.js:79-95](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/actions/visitable.js#L79-L95 "Source code on GitHub")

Loads a given route, result descriptor can be called with dynamic segments and parameters.

**Parameters**

-   `path` **string** Full path of the route to visit

**Examples**

```javascript
var page = PageObject.create({
  visit: PageObject.visitable('/users')
});

// visits '/users'
page.visit();
```

```javascript
var page = PageObject.create({
  visit: PageObject.visitable('/users/:user_id')
});

// visits '/users/10'
page.visit({ user_id: 10 });
```

```javascript
var page = PageObject.create({
  visit: PageObject.visitable('/users')
});

// visits '/users?name=john'
page.visit({ name: 'john' });
```

```javascript
var page = PageObject.create({
  visit: PageObject.visitable('/users/:user_id')
});

// visits '/users/1?name=john'
page.visit({ id: 1 }, { name: 'john' });
```

Returns **Descriptor** 
