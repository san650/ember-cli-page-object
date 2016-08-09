---
layout: api
title: Queries
---

{% raw %}
### Methods

- [attribute](#attribute)
- [count](#count)
- [is](#is)
- [property](#property)
- [text](#text)
- [value](#value)

## attribute

[addon/queries/attribute.js:67-82](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/queries/attribute.js#L67-L82 "Source code on GitHub")

Returns the value of an attribute from the matched element, or an array of
values from multiple matched elements.

**Parameters**

-   `attributeName` **string** Name of the attribute to get
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
    -   `options.testContainer` **String** Context where to search elements in the DOM

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

## count

[addon/queries/count.js:74-86](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/queries/count.js#L74-L86 "Source code on GitHub")

Returns the number of elements matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element or elements to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Add scope
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **String** Context where to search elements in the DOM

**Examples**

```javascript
// <span>1</span>
// <span>2</span>

const page = PageObject.create({
  spanCount: PageObject.count('span')
});

assert.equal(page.spanCount, 2);
```

```javascript
// <div>Text</div>

const page = PageObject.create({
  spanCount: PageObject.count('span')
});

assert.equal(page.spanCount, 0);
```

```javascript
// <div><span></span></div>
// <div class="scope"><span></span><span></span></div>

const page = PageObject.create({
  spanCount: PageObject.count('span', { scope: '.scope' })
});

assert.equal(page.spanCount, 2)
```

```javascript
// <div><span></span></div>
// <div class="scope"><span></span><span></span></div>

const page = PageObject.create({
  scope: '.scope',
  spanCount: PageObject.count('span')
});

assert.equal(page.spanCount, 2)
```

```javascript
// <div><span></span></div>
// <div class="scope"><span></span><span></span></div>

const page = PageObject.create({
  scope: '.scope',
  spanCount: PageObject.count('span', { resetScope: true })
});

assert.equal(page.spanCount, 1);
```

Returns **Descriptor** 

## is

[addon/queries/is.js:42-56](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/queries/is.js#L42-L56 "Source code on GitHub")

Validates if an element (or elements) matches a given selector.

Useful for checking if an element (or elements) matches a selector like
`:disabled` or `:checked`, which can be the result of either an attribute
(`disabled="disabled"`, `disabled=true`) or a property (`disabled`).

**Parameters**

-   `testSelector` **string** CSS selector to test
-   `targetSelector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
    -   `options.testContainer` **String** Context where to search elements in the DOM

**Examples**

```javascript
// <input type="checkbox" checked="checked">
// <input type="checkbox" checked>

const page = PageObject.create({
  areInputsChecked: is(':checked', 'input', { multiple: true })
});

assert.equal(page.areInputsChecked, true, 'Inputs are checked');
```

```javascript
// <button class="toggle-button active" disabled>Toggle something</button>

const page = PageObject.create({
  isToggleButtonActive: is('.active:disabled', '.toggle-button')
});

assert.equal(page.isToggleButtonActive, true, 'Button is active');
```

Returns **Descriptor** 

## property

[addon/queries/property.js:53-68](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/queries/property.js#L53-L68 "Source code on GitHub")

Returns the value of a property from the matched element, or an array of
values from multiple matched elements.

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

## text

[addon/queries/text.js:85-97](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/queries/text.js#L85-L97 "Source code on GitHub")

Returns text of the element or Array of texts of all matched elements by selector.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Return an array of values
    -   `options.normalize` **boolean** Set to `false` to avoid text normalization
    -   `options.testContainer` **String** Context where to search elements in the DOM

**Examples**

```javascript
// Hello <span>world!</span>

const page = PageObject.create({
  text: PageObject.text('span')
});

assert.equal(page.text, 'world!');
```

```javascript
// <span>lorem</span>
// <span> ipsum </span>
// <span>dolor</span>

const page = PageObject.create({
  texts: PageObject.text('span', { multiple: true })
});

assert.deepEqual(page.texts, ['lorem', 'ipsum', 'dolor']);
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  text: PageObject.text('span', { scope: '.scope' })
});

assert.equal(page.text, 'ipsum');
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scope: '.scope',
  text: PageObject.text('span')
});

// returns 'ipsum'
assert.equal(page.text, 'ipsum');
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope">
//  ipsum
// </div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scope: '.scope',
  text: PageObject.text('span', { normalize: false })
});

// returns 'ipsum'
assert.equal(page.text, '\n ipsum\n');
```

Returns **Descriptor** 

## value

[addon/queries/value.js:64-79](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/queries/value.js#L64-L79 "Source code on GitHub")

Returns the value of a matched element, or an array of values of all matched elements.

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
