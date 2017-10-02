---
layout: page
title: Attribute
---

{% raw %}
### Methods

- [attribute](#attribute)

## attribute

[addon/-private/properties/attribute.js:70-90](https://github.com/san650/ember-cli-page-object/blob/f70ce5d253619a25948ed1de7c34cb3f3978c953/addon/-private/properties/attribute.js#L70-L90 "Source code on GitHub")

**Parameters**

-   `attributeName` **string** Name of the attribute to get
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <input placeholder="a value">

const page = PageObject.create({
  inputPlaceholder: PageObject.attribute('placeholder', 'input')
});

assert.equal(page.inputPlaceholder, 'a value');
```

```javascript
// <input placeholder="a value">
// <input placeholder="other value">

const page = PageObject.create({
  inputPlaceholders: PageObject.attribute('placeholder', ':input', { multiple: true })
});

assert.deepEqual(page.inputPlaceholders, ['a value', 'other value']);
```

```javascript
// <div><input></div>
// <div class="scope"><input placeholder="a value"></div>
// <div><input></div>

const page = PageObject.create({
  inputPlaceholder: PageObject.attribute('placeholder', ':input', { scope: '.scope' })
});

assert.equal(page.inputPlaceholder, 'a value');
```

```javascript
// <div><input></div>
// <div class="scope"><input placeholder="a value"></div>
// <div><input></div>

const page = PageObject.create({
  scope: 'scope',
  inputPlaceholder: PageObject.attribute('placeholder', ':input')
});

assert.equal(page.inputPlaceholder, 'a value');
```

Returns **Descriptor** 
{% endraw %}