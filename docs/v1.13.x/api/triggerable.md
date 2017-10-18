---
layout: page
title: Triggerable
---

{% raw %}
### Methods

- [triggerable](#triggerable)

## triggerable

[addon/-private/properties/triggerable.js:85-107](https://github.com/san650/ember-cli-page-object/blob/f70ce5d253619a25948ed1de7c34cb3f3978c953/addon/-private/properties/triggerable.js#L85-L107 "Source code on GitHub")

Triggers event on element matched by selector.

**Parameters**

-   `event` **string** Event to be triggered
-   `selector` **string** CSS selector of the element on which the event will be triggered
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **string** Context where to search elements in the DOM
    -   `options.eventProperties` **string** Event properties that will be passed to trigger function
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <input class="name">
// <input class="email">

const page = PageObject.create({
  focus: triggerable('focus', '.name')
});

// focuses on element with selector '.name'
page.focus();
```

```javascript
// <input class="name">
// <input class="email">

const page = PageObject.create({
  enter: triggerable('keypress', '.name', { eventProperties: { keyCode: 13 } })
});

// triggers keypress using enter key on element with selector '.name'
page.enter();
```

```javascript
// <input class="name">
// <input class="email">

const page = PageObject.create({
  keydown: triggerable('keypress', '.name')
});

// triggers keypress using enter key on element with selector '.name'
page.keydown({ which: 13 });
```

```javascript
// <div class="scope">
//   <input class="name">
// </div>
// <input class="email">

const page = PageObject.create({
  focus: triggerable('focus', '.name', { scope: '.scope' })
});

// focuses on element with selector '.scope .name'
page.focus();
```

```javascript
// <div class="scope">
//   <input class="name">
// </div>
// <input class="email">

const page = PageObject.create({
  scope: '.scope',
  focus: triggerable('focus', '.name')
});

// focuses on element with selector '.scope .name'
page.focus();
```

Returns **Descriptor** 
{% endraw %}