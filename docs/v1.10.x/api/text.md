---
layout: page
title: Text
---

{% raw %}
### Methods

- [text](#text)

## text

[addon/-private/properties/text.js:92-112](https://github.com/san650/ember-cli-page-object/blob/eeba8e285bd3a52c66ab6d2979f23b64bf9235fd/addon/-private/properties/text.js#L92-L112 "Source code on GitHub")

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Return an array of values
    -   `options.normalize` **boolean** Set to `false` to avoid text normalization
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

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
{% endraw %}