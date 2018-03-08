---
layout: page
title: Extend
---

{% raw %}
### Methods

You can create custom helpers by creating `Ceibo` descriptors. (`Ceibo` is a small library for parsing trees. You can check it out [here](http://github.com/san650/ceibo)).

- [findElementWithAssert](#findelementwithassert)
- [findElement](#findelement)

## findElementWithAssert

[addon/-private/extend/find-element-with-assert.js:38-44](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/extend/find-element-with-assert.js#L38-L44 "Source code on GitHub")

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

export default function isDisabled(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      return findElementWithAssert(this, selector, options).is(':disabled');
    }
  };
}
```

## findElement

[addon/-private/extend/find-element.js:36-42](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/extend/find-element.js#L36-L42 "Source code on GitHub")

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

export default function isDisabled(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      return findElement(this, selector, options).is(':disabled');
    }
  };
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
