---
layout: api
title: Queries
---

{% raw %}
### Methods

- [attribute](#attribute)
- [count](#count)
- [text](#text)
- [value](#value)

## attribute

[test-support/page-object/queries/attribute.js:66-81](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/queries/attribute.js#L66-L81 "Source code on GitHub")

Returns the value of an attribute from the matched element,
or an array of values from multiple matched elements.

**Parameters**

-   `attributeName` **string** Name of the attribute to get
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values

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

[test-support/page-object/queries/count.js:73-85](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/queries/count.js#L73-L85 "Source code on GitHub")

Returns the number of elements matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element or elements to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Add scope
    -   `options.resetScope` **boolean** Ignore parent scope

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

## text

[test-support/page-object/queries/text.js:67-80](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/queries/text.js#L67-L80 "Source code on GitHub")

Returns text of the element or Array of texts of all matched elements by selector.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Return an array of values

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

Returns **Descriptor** 

## value

[test-support/page-object/queries/value.js:63-78](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/queries/value.js#L63-L78 "Source code on GitHub")

Returns the value of a matched element, or an array of values of all matched elements.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values

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
