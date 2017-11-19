---
layout: page
title: Is present
---

{% raw %}
### Methods

- [isPresent](#ispresent)

## isPresent

[addon/-private/properties/is-present.js:74-81](https://github.com/san650/ember-cli-page-object/blob/f70ce5d253619a25948ed1de7c34cb3f3978c953/addon/-private/properties/is-present.js#L74-L81 "Source code on GitHub")

Validates if any element matching the target selector is rendered in the DOM.

`isPresent` vs. `isVisible`:

-   Both validate that an element matching the target selector can be found in the DOM
-   `isVisible` additionally validates that all matching elements are visible

Some uses cases for `isPresent` over `isVisible`:

-   To check for the presence of a tag that is never visible in the DOM (e.g., <meta>).
-   To validate that, even though an element may not currently be visible, it is still in the DOM.
-   To validate that an element has not merely been hidden but has in fact been removed from the DOM.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector are visible
    -   `options.testContainer` **string** Context where to search elements in the DOM

**Examples**

```javascript
// Lorem <span>ipsum</span>

const page = PageObject.create({
  spanIsPresent: PageObject.isPresent('span')
});

assert.ok(page.spanIsPresent);
```

```javascript
// <span>ipsum</span>
// <span style="display:none">dolor</span>

const page = PageObject.create({
  spanIsPresent: PageObject.isPresent('span', { multiple: true })
});

assert.ok(page.spanIsPresent);
```

```javascript
// <head>
//   <meta name='robots' content='noindex'>
// </head>

const page = PageObject.create({
  notIndexed: PageObject.isPresent(`meta[name='robots'][content='noindex']`, {
    testContainer: 'head'
  })
});

assert.ok(page.notIndexed);
```

```javascript
// Lorem <strong>ipsum</strong>

const page = PageObject.create({
  spanIsPresent: PageObject.isPresent('span')
});

// returns false when element doesn't exist in DOM
assert.notOk(page.spanIsPresent);
```

Returns **Descriptor** 
{% endraw %}