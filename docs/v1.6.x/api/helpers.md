---
layout: api
title: Helpers
---

{% raw %}
### Methods

- [buildSelector](#buildselector)
- [getContext](#getcontext)

## buildSelector

[addon/-private/helpers.js:131-133](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/helpers.js#L131-L133 "Source code on GitHub")

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

## getContext

[addon/-private/helpers.js:193-202](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/helpers.js#L193-L202 "Source code on GitHub")

**Parameters**

-   `node` **Ceibo** Node of the tree

Returns **** The test's `this` context, or null
{% endraw %}