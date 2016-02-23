---
layout: page
title: Helpers
---

### Methods

- [buildSelector](#buildselector)
- [findElement](#findelement)
- [findElementWithAssert](#findelementwithassert)
- [normalizeText](#normalizetext)

## buildSelector

[test-support/page-object/helpers.js:118-120](https://github.com/san650/ember-cli-page-object/blob/b9a36f01a8b3d265c7a14aa6bac29e4260d08e8c/test-support/page-object/helpers.js#L118-L120 "Source code on GitHub")

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

[test-support/page-object/helpers.js:166-173](https://github.com/san650/ember-cli-page-object/blob/b9a36f01a8b3d265c7a14aa6bac29e4260d08e8c/test-support/page-object/helpers.js#L166-L173 "Source code on GitHub")

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

Returns **Object** jQuery object

## findElementWithAssert

[test-support/page-object/helpers.js:140-147](https://github.com/san650/ember-cli-page-object/blob/b9a36f01a8b3d265c7a14aa6bac29e4260d08e8c/test-support/page-object/helpers.js#L140-L147 "Source code on GitHub")

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

Returns **Object** jQuery object

## normalizeText

[test-support/page-object/helpers.js:183-185](https://github.com/san650/ember-cli-page-object/blob/b9a36f01a8b3d265c7a14aa6bac29e4260d08e8c/test-support/page-object/helpers.js#L183-L185 "Source code on GitHub")

Trim whitespaces at both ends and normalize whitespaces inside `text`

Due to variations in the HTML parsers in different browsers, the text
returned may vary in newlines and other white space.

**Parameters**

-   `text`  
