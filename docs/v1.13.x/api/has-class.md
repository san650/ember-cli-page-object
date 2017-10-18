---
layout: page
title: Has class
---

{% raw %}
### Methods

- [hasClass](#hasclass)

## hasClass

[addon/-private/properties/has-class.js:85-102](https://github.com/san650/ember-cli-page-object/blob/f70ce5d253619a25948ed1de7c34cb3f3978c953/addon/-private/properties/has-class.js#L85-L102 "Source code on GitHub")

Validates if an element or a set of elements have a given CSS class.

**Parameters**

-   `cssClass` **string** CSS class to be validated
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector have the CSS class
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <em class="lorem"></em><span class="success">Message!</span>

const page = PageObject.create({
  messageIsSuccess: PageObject.hasClass('success', 'span')
});

assert.ok(page.messageIsSuccess);
```

```javascript
// <span class="success"></span>
// <span class="error"></span>

const page = PageObject.create({
  messagesAreSuccessful: PageObject.hasClass('success', 'span', { multiple: true })
});

assert.notOk(page.messagesAreSuccessful);
```

```javascript
// <span class="success"></span>
// <span class="success"></span>

const page = PageObject.create({
  messagesAreSuccessful: PageObject.hasClass('success', 'span', { multiple: true })
});

assert.ok(page.messagesAreSuccessful);
```

```javascript
// <div>
//   <span class="lorem"></span>
// </div>
// <div class="scope">
//   <span class="ipsum"></span>
// </div>

const page = PageObject.create({
  spanHasClass: PageObject.hasClass('ipsum', 'span', { scope: '.scope' })
});

assert.ok(page.spanHasClass);
```

```javascript
// <div>
//   <span class="lorem"></span>
// </div>
// <div class="scope">
//   <span class="ipsum"></span>
// </div>

const page = PageObject.create({
  scope: '.scope',
  spanHasClass: PageObject.hasClass('ipsum', 'span')
});

assert.ok(page.spanHasClass);
```

Returns **Descriptor** 
{% endraw %}