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

[addon/helpers.js:120-122](https://github.com/san650/ember-cli-page-object/blob/559c583f5ae5de8a69c2b4552398ae47310af700/addon/helpers.js#L120-L122 "Source code on GitHub")

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

[addon/helpers.js:184-200](https://github.com/san650/ember-cli-page-object/blob/559c583f5ae5de8a69c2b4552398ae47310af700/addon/helpers.js#L184-L200 "Source code on GitHub")

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

[addon/helpers.js:142-165](https://github.com/san650/ember-cli-page-object/blob/559c583f5ae5de8a69c2b4552398ae47310af700/addon/helpers.js#L142-L165 "Source code on GitHub")

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

[addon/helpers.js:254-263](https://github.com/san650/ember-cli-page-object/blob/559c583f5ae5de8a69c2b4552398ae47310af700/addon/helpers.js#L254-L263 "Source code on GitHub")

Return a test context if one was provided during `create()`

**Parameters**

-   `node` **Ceibo** Node of the tree

Returns **** The test's `this` context, or null

## getRoot

[addon/helpers.js:236-246](https://github.com/san650/ember-cli-page-object/blob/559c583f5ae5de8a69c2b4552398ae47310af700/addon/helpers.js#L236-L246 "Source code on GitHub")

Return the root of a node's tree

**Parameters**

-   `node` **Ceibo** Node of the tree

Returns **Ceibo** node - Root node of the tree

## normalizeText

[addon/helpers.js:210-212](https://github.com/san650/ember-cli-page-object/blob/559c583f5ae5de8a69c2b4552398ae47310af700/addon/helpers.js#L210-L212 "Source code on GitHub")

Trim whitespaces at both ends and normalize whitespaces inside `text`

Due to variations in the HTML parsers in different browsers, the text
returned may vary in newlines and other white space.

**Parameters**

-   `text`  
{% endraw %}