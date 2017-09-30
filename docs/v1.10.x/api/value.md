---
layout: page
title: Value
---

{% raw %}
### Methods

- [value](#value)

## value

[addon/-private/properties/value.js:79-103](https://github.com/san650/ember-cli-page-object/blob/eeba8e285bd3a52c66ab6d2979f23b64bf9235fd/addon/-private/properties/value.js#L79-L103 "Source code on GitHub")

**Parameters**

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
// <input value="Lorem ipsum">

const page = PageObject.create({
  value: PageObject.value('input')
});

assert.equal(page.value, 'Lorem ipsum');
```

```javascript
// <div contenteditable="true"><b>Lorem ipsum</b></div>

const page = PageObject.create({
  value: PageObject.value('[contenteditable]')
});

assert.equal(page.value, '<b>Lorem ipsum</b>');
```

```javascript
// <input value="lorem">
// <input value="ipsum">

const page = PageObject.create({
  value: PageObject.value('input', { multiple: true })
});

assert.deepEqual(page.value, ['lorem', 'ipsum']);
```

```javascript
// <div><input value="lorem"></div>
// <div class="scope"><input value="ipsum"></div>

const page = PageObject.create({
  value: PageObject.value('input', { scope: '.scope' })
});

assert.equal(page.value, 'ipsum');
```

```javascript
// <div><input value="lorem"></div>
// <div class="scope"><input value="ipsum"></div>

const page = PageObject.create({
  scope: '.scope',
  value: PageObject.value('input')
});

assert.equal(page.value, 'ipsum');
```

Returns **Descriptor** 
{% endraw %}