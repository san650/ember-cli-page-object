---
layout: api
title: Triggerable
---

{% raw %}
### Methods

- [triggerable](#triggerable)

## triggerable

[addon/-private/properties/triggerable.js:73-93](undefined/blob/fffa214390f41841c5e104729fb459d2cb25b5e9/addon/-private/properties/triggerable.js#L73-L93 "Source code on GitHub")

Triggers event on element matched by selector.

**Parameters**

-   `event` **string** Event to be triggered
-   `selector` **string** CSS selector of the element on which the event will be triggered
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **String** Context where to search elements in the DOM
    -   `options.eventProperties` **String** Event properties that will be passed to trigger function

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

// clicks on element with selector '.scope button.continue'
page.focus();
```

Returns **Descriptor** 
{% endraw %}
