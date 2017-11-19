---
layout: page
title: Is hidden
---

{% raw %}
### Methods

- [isHidden](#ishidden)

## isHidden

[addon/-private/properties/is-hidden.js:90-107](https://github.com/san650/ember-cli-page-object/blob/f70ce5d253619a25948ed1de7c34cb3f3978c953/addon/-private/properties/is-hidden.js#L90-L107 "Source code on GitHub")

Validates if an element or set of elements is hidden or does not exist in the DOM.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector are hidden
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// Lorem <span style="display:none">ipsum</span>

const page = PageObject.create({
  spanIsHidden: PageObject.isHidden('span')
});

assert.ok(page.spanIsHidden);
```

```javascript
// <span>ipsum</span>
// <span style="display:none">dolor</span>

const page = create({
  spansAreHidden: PageObject.isHidden('span', { multiple: true })
});

// not all spans are hidden
assert.notOk(page.spansAreHidden);
```

```javascript
// <span style="display:none">dolor</span>
// <span style="display:none">dolor</span>

const page = create({
  spansAreHidden: PageObject.isHidden('span', { multiple: true })
});

// all spans are hidden
assert.ok(page.spansAreHidden);
```

```javascript
// Lorem <strong>ipsum</strong>

const page = PageObject.create({
  spanIsHidden: PageObject.isHidden('span')
});

// returns true when element doesn't exist in DOM
assert.ok(page.spanIsHidden);
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span style="display:none">ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scopedSpanIsHidden: PageObject.isHidden('span', { scope: '.scope' })
});

assert.ok(page.scopedSpanIsHidden);
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span style="display:none">ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scope: '.scope',
  scopedSpanIsHidden: PageObject.isHidden('span')
});

assert.ok(page.scopedSpanIsHidden);
```

Returns **Descriptor** 
{% endraw %}