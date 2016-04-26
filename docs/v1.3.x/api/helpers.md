---
layout: page
title: Helpers
---

{% raw %}
### Methods

- [buildSelector](#buildselector)
- [findElement](#findelement)
- [findElementWithAssert](#findelementwithassert)
- [getContext](#getcontext)
- [getRoot](#getroot)
- [normalizeText](#normalizetext)

## buildSelector

[addon/helpers.js:118-120](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/helpers.js#L118-L120 "Source code on GitHub")

Builds a CSS selector from a target selector and a PageObject or a node in a PageObject, along with optional parameters.

**Parameters**

-   `node` **Ceibo** Node of the tree
-   `targetSelector` **string** CSS selector
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.at` **number** Filter by index using :eq(x) pseudo-class
    -   `options.last` **boolean** Filter by using :last pseudo-class

**Examples**

```javascript
const component = PageObject.create({ scope: '.component'});

buildSelector(component, '.my-element');
// returns '.component .my-element'
```

```javascript
const page = PageObject.create({});

buildSelector(page, '.my-element', { at: 0 });
// returns '.my-element:eq(0)'
```

```javascript
const page = PageObject.create({});

buildSelector(page, '.my-element', { contains: "Example" });
// returns ".my-element :contains('Example')"
```

```javascript
const page = PageObject.create({});

buildSelector(page, '.my-element', { last: true });
// returns '.my-element:last'
```

Returns **string** Fully qualified selector

## findElement

[addon/helpers.js:219-239](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/helpers.js#L219-L239 "Source code on GitHub")

Returns a jQuery element (can be an empty jQuery result)

**Parameters**

-   `node` **Ceibo** Node of the tree
-   `targetSelector` **string** Specific CSS selector
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.at` **number** Filter by index using :eq(x) pseudo-class
    -   `options.last` **boolean** Filter by using :last pseudo-class
    -   `options.multiple` **boolean** Specify if built selector can match multiple elements.
    -   `options.testContainer` **String** Context where to search elements in the DOM

Returns **Object** jQuery object

## findElementWithAssert

[addon/helpers.js:161-165](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/helpers.js#L161-L165 "Source code on GitHub")

Returns a jQuery element matched by a selector built from parameters

**Parameters**

-   `node` **Ceibo** Node of the tree
-   `targetSelector` **string** Specific CSS selector
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.at` **number** Filter by index using :eq(x) pseudo-class
    -   `options.last` **boolean** Filter by using :last pseudo-class
    -   `options.multiple` **boolean** Specify if built selector can match multiple elements.
    -   `options.testContainer` **String** Context where to search elements in the DOM
    -   `options.pageObjectKey` **String** Used in the error message when the element is not found

Returns **Object** jQuery object

## getContext

[addon/helpers.js:293-302](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/helpers.js#L293-L302 "Source code on GitHub")

Return a test context if one was provided during `create()`

**Parameters**

-   `node` **Ceibo** Node of the tree

Returns **** The test's `this` context, or null

## getRoot

[addon/helpers.js:275-285](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/helpers.js#L275-L285 "Source code on GitHub")

Return the root of a node's tree

**Parameters**

-   `node` **Ceibo** Node of the tree

Returns **Ceibo** node - Root node of the tree

## normalizeText

[addon/helpers.js:249-251](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/helpers.js#L249-L251 "Source code on GitHub")

Trim whitespaces at both ends and normalize whitespaces inside `text`

Due to variations in the HTML parsers in different browsers, the text
returned may vary in newlines and other white space.

**Parameters**

-   `text`  
{% endraw %}