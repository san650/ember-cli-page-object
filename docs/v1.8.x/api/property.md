---
layout: api
title: Property
---

{% raw %}
### Methods

- [property](#property)

## property

[addon/-private/properties/property.js:56-76](undefined/blob/fffa214390f41841c5e104729fb459d2cb25b5e9/addon/-private/properties/property.js#L56-L76 "Source code on GitHub")

**Parameters**

-   `propertyName` **string** Name of the property to get
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values

**Examples**

```javascript
// <input type="checkbox" checked="checked">

const page = PageObject.create({
  isChecked: PageObject.property('checked', 'input')
});

assert.ok(page.isChecked);
```

```javascript
// <input type="checkbox" checked="checked">
// <input type="checkbox" checked="">

const page = PageObject.create({
  inputsChecked: PageObject.property('checked', 'input', { multiple: true })
});

assert.deepEqual(page.inputsChecked, [true, false]);
```

```javascript
// <div><input></div>
// <div class="scope"><input type="checkbox" checked="checked"></div>
// <div><input></div>

const page = PageObject.create({
  isChecked: PageObject.property('checked', 'input', { scope: '.scope' })
});

assert.ok(page.isChecked);
```

Returns **Descriptor** 
{% endraw %}
