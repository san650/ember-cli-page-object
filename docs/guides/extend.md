---
layout: page
title: Extend
---

{% raw %}
### Methods

You can create custom helpers by creating `Ceibo` descriptors. (`Ceibo` is a small library for parsing trees. You can check it out [here](http://github.com/san650/ceibo)).

- [findOne](#findone)
- [findMany](#findmany)
- [findElementWithAssert](#findelementwithassert)
- [findElement](#findelement)

## findOne

[addon/-private/extend/find-one.js:38-44](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/extend/find-element-with-assert.js#L38-L44 "Source code on GitHub")

**Parameters**

-   `pageObjectNode` **Ceibo** Node of the tree
-   `targetSelector` **string** Specific CSS selector
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.last` **boolean** Filter by using :last pseudo-class
    -   `options.visible` **boolean** Filter by using :visible pseudo-class
    -   `options.testContainer` **String** Context where to search elements in the DOM
    -   `options.at` **number** Filter by index using :eq(x) pseudo-class
    -   `options.pageObjectKey` **String** Used in the error message when the element is not found

**Examples**

```javascript
import { findOne } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

export default function isDisabled(selector, options = {}) {
  return getter(function() {
    return findOne(this, selector, options).disabled;
  });
}
```

## findMany

[addon/-private/extend/find-many.js:38-44](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/extend/find-element-with-assert.js#L38-L44 "Source code on GitHub")

**Parameters**

-   `pageObjectNode` **Ceibo** Node of the tree
-   `targetSelector` **string** Specific CSS selector
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.visible` **boolean** Filter by using :visible pseudo-class
    -   `options.testContainer` **String** Context where to search elements in the DOM
    -   `options.pageObjectKey` **String** Used in the error message when the element is not found

**Examples**

```javascript
import { findMany } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

export default function count(selector, options = {}) {
  return getter(function() {
    return findMany(this, selector, options).length;
  });
}
```

## findElementWithAssert

[addon/-private/extend/find-element-with-assert.js:38-44](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/extend/find-element-with-assert.js#L38-L44 "Source code on GitHub")

Note: in the v2 series we are going to deprecate `findElementWithAssert`. It's recommended to migrate to use `findOne` instead.

In order to ease the migration, you may find useful the [`find-one`](https://github.com/ro0gr/ember-page-object-codemod/tree/master/transforms/find-one) codemod to perform the migration.

**Parameters**

-   `pageObjectNode` **Ceibo** Node of the tree
-   `targetSelector` **string** Specific CSS selector
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.last` **boolean** Filter by using :last pseudo-class
    -   `options.visible` **boolean** Filter by using :visible pseudo-class
    -   `options.multiple` **boolean** Specify if built selector can match multiple elements.
    -   `options.testContainer` **String** Context where to search elements in the DOM
    -   `options.at` **number** Filter by index using :eq(x) pseudo-class
    -   `options.pageObjectKey` **String** Used in the error message when the element is not found

**Examples**

```javascript
import { findElementWithAssert } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

export default function count(selector, options = {}) {
  return getter(function() {
    return findElementWithAssert(this, selector, options).is(':disabled');
  });
}
```

## findElement

[addon/-private/extend/find-element.js:36-42](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/extend/find-element.js#L36-L42 "Source code on GitHub")

Note: in the v2 series we are going to deprecate `findElement`. It's recommended to migrate to use `findMany` instead.

**Parameters**

-   `pageObjectNode` **Ceibo** Node of the tree
-   `targetSelector` **string** Specific CSS selector
-   `options` **Object** Additional options
    -   `options.resetScope` **boolean** Do not use inherited scope
    -   `options.contains` **string** Filter by using :contains('foo') pseudo-class
    -   `options.at` **number** Filter by index using :eq(x) pseudo-class
    -   `options.last` **boolean** Filter by using :last pseudo-class
    -   `options.visible` **boolean** Filter by using :visible pseudo-class
    -   `options.multiple` **boolean** Specify if built selector can match multiple elements.
    -   `options.testContainer` **String** Context where to search elements in the DOM

**Examples**

```javascript
import { findElement } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

export default function isDisabled(selector, options = {}) {
  return getter(function() {
    return findElement(this, selector, options).is(':disabled');
  });
}
```

Usage Example:

```js
const page = create({
  scope: '.page',

  isAdmin: disabled('#override-name')
});
```

`page.isAdmin` will look for elements in the DOM that match ".page
\#override-name" and check if they are disabled.

{% endraw %}
