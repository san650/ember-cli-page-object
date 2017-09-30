---
layout: page
title: Click on-text
---

{% raw %}
### Methods

- [clickOnText](#clickontext)

## clickOnText

[addon/-private/properties/click-on-text.js:81-101](https://github.com/san650/ember-cli-page-object/blob/eeba8e285bd3a52c66ab6d2979f23b64bf9235fd/addon/-private/properties/click-on-text.js#L81-L101 "Source code on GitHub")

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
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

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
{% endraw %}