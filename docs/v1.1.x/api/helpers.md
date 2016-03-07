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

[test-support/page-object/helpers.js:118-120](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/helpers.js#L118-L120 "Source code on GitHub")

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

[test-support/page-object/helpers.js:182-198](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/helpers.js#L182-L198 "Source code on GitHub")

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

[test-support/page-object/helpers.js:140-163](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/helpers.js#L140-L163 "Source code on GitHub")

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

## getContext

[test-support/page-object/helpers.js:252-261](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/helpers.js#L252-L261 "Source code on GitHub")

Return a test context if one was provided during `create()`

**Parameters**

-   `node` **Ceibo** Node of the tree

Returns **** The test's `this` context, or null

## getRoot

[test-support/page-object/helpers.js:234-244](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/helpers.js#L234-L244 "Source code on GitHub")

Return the root of a node's tree

**Parameters**

-   `node` **Ceibo** Node of the tree

Returns **Ceibo** node - Root node of the tree

## normalizeText

[test-support/page-object/helpers.js:208-210](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/helpers.js#L208-L210 "Source code on GitHub")

Trim whitespaces at both ends and normalize whitespaces inside `text`

Due to variations in the HTML parsers in different browsers, the text
returned may vary in newlines and other white space.

**Parameters**

-   `text`  
{% endraw %}