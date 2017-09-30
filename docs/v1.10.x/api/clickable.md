---
layout: page
title: Clickable
---

{% raw %}
### Methods

- [clickable](#clickable)

## clickable

[addon/-private/properties/clickable.js:59-79](https://github.com/san650/ember-cli-page-object/blob/eeba8e285bd3a52c66ab6d2979f23b64bf9235fd/addon/-private/properties/clickable.js#L59-L79 "Source code on GitHub")

Clicks elements matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element to click
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.visible` **boolean** Make the action to raise an error if the element is not visible
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <button class="continue">Continue<button>
// <button>Cancel</button>

const page = PageObject.create({
  continue: clickable('button.continue')
});

// clicks on element with selector 'button.continue'
page.continue();
```

```javascript
// <div class="scope">
//   <button>Continue<button>
// </div>
// <button>Cancel</button>

const page = PageObject.create({
  continue: clickable('button.continue', { scope: '.scope' })
});

// clicks on element with selector '.scope button.continue'
page.continue();
```

```javascript
// <div class="scope">
//   <button>Continue<button>
// </div>
// <button>Cancel</button>

const page = PageObject.create({
  scope: '.scope',
  continue: clickable('button.continue')
});

// clicks on element with selector '.scope button.continue'
page.continue();
```

Returns **Descriptor** 
{% endraw %}