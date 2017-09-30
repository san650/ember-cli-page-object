---
layout: page
title: Contains
---

{% raw %}
### Methods

- [contains](#contains)

## contains

[addon/-private/properties/contains.js:84-103](https://github.com/san650/ember-cli-page-object/blob/eeba8e285bd3a52c66ab6d2979f23b64bf9235fd/addon/-private/properties/contains.js#L84-L103 "Source code on GitHub")

Returns a boolean representing whether an element or a set of elements contains the specified text.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector contain the subtext
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// Lorem <span>ipsum</span>

const page = PageObject.create({
  spanContains: PageObject.contains('span')
});

assert.ok(page.spanContains('ipsum'));
```

```javascript
// <span>lorem</span>
// <span>ipsum</span>
// <span>dolor</span>

const page = PageObject.create({
  spansContain: PageObject.contains('span', { multiple: true })
});

// not all spans contain 'lorem'
assert.notOk(page.spansContain('lorem'));
```

```javascript
// <span>super text</span>
// <span>regular text</span>

const page = PageObject.create({
  spansContain: PageObject.contains('span', { multiple: true })
});

// all spans contain 'text'
assert.ok(page.spanContains('text'));
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  spanContains: PageObject.contains('span', { scope: '.scope' })
});

assert.notOk(page.spanContains('lorem'));
assert.ok(page.spanContains('ipsum'));
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scope: '.scope',

  spanContains: PageObject.contains('span')
});

assert.notOk(page.spanContains('lorem'));
assert.ok(page.spanContains('ipsum'));
```

Returns **Descriptor** 
{% endraw %}