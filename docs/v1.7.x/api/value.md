---
layout: page
title: Value
---

{% raw %}
### Methods

- [value](#value)

## value

[addon/-private/properties/value.js:67-87](undefined/blob/fffa214390f41841c5e104729fb459d2cb25b5e9/addon/-private/properties/value.js#L67-L87 "Source code on GitHub")

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
    -   `options.testContainer` **String** Context where to search elements in the DOM

**Examples**

```javascript
// <input value="Lorem ipsum">

const page = PageObject.create({
  value: PageObject.value('input')
});

assert.equal(page.value, 'Lorem ipsum');
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
