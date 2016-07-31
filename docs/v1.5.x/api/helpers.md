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

[addon/helpers.js:123-125](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/helpers.js#L123-L125 "Source code on GitHub")

Builds a CSS selector from a target selector and a PageObject or a node in a PageObject, along with optional parameters.

**Parameters**

-   `node` **Ceibo** Node of the tree
-   `targetSelector` **string** CSS selector
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.at` **number** Filter by index using :eq(x) pseudo-class
    -   `options.last` **boolean** Filter by using :last pseudo-class
    -   `options.visible` **boolean** Filter by using :visible pseudo-class

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

[addon/helpers.js:226-246](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/helpers.js#L226-L246 "Source code on GitHub")

Returns a jQuery element (can be an empty jQuery result)

**Parameters**

-   `node` **Ceibo** Node of the tree
-   `targetSelector` **string** Specific CSS selector
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.at` **number** Filter by index using :eq(x) pseudo-class
    -   `options.last` **boolean** Filter by using :last pseudo-class
    -   `options.visible` **boolean** Filter by using :visible pseudo-class
    -   `options.multiple` **boolean** Specify if built selector can match multiple elements.
    -   `options.testContainer` **String** Context where to search elements in the DOM

Returns **Object** jQuery object

## findElementWithAssert

[addon/helpers.js:167-171](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/helpers.js#L167-L171 "Source code on GitHub")

Returns a jQuery element matched by a selector built from parameters

**Parameters**

-   `node` **Ceibo** Node of the tree
-   `options.pageObjectKey` **String** Used in the error message when the element is not found
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.last` **boolean** Filter by using :last pseudo-class
    -   `options.visible` **boolean** Filter by using :visible pseudo-class
    -   `options.multiple` **boolean** Specify if built selector can match multiple elements.
    -   `options.testContainer` **String** Context where to search elements in the DOM
    -   `options.at` **number** Filter by index using :eq(x) pseudo-class
-   `targetSelector` **string** Specific CSS selector

Returns **Object** jQuery object

## getContext

[addon/helpers.js:300-309](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/helpers.js#L300-L309 "Source code on GitHub")

Return a test context if one was provided during `create()`

**Parameters**

-   `node` **Ceibo** Node of the tree

Returns **** The test's `this` context, or null

## getRoot

[addon/helpers.js:282-292](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/helpers.js#L282-L292 "Source code on GitHub")

Return the root of a node's tree

**Parameters**

-   `node` **Ceibo** Node of the tree

Returns **Ceibo** node - Root node of the tree

## normalizeText

[addon/helpers.js:256-258](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/helpers.js#L256-L258 "Source code on GitHub")

Trim whitespaces at both ends and normalize whitespaces inside `text`

Due to variations in the HTML parsers in different browsers, the text
returned may vary in newlines and other white space.

**Parameters**

-   `text`  
{% endraw %}