---
layout: page
title: Is visible
---

{% raw %}
### Methods

- [isVisible](#isvisible)

## isVisible

[addon/-private/properties/is-visible.js:96-117](https://github.com/AltSchool/ember-cli-page-object/blob/217d647ec34ad8b1686d824d16a2253fbcd5e22b/addon/-private/properties/is-visible.js#L96-L117 "Source code on GitHub")

Validates if an element or set of elements are visible.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector are visible
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// Lorem <span>ipsum</span>

const page = PageObject.create({
  spanIsVisible: PageObject.isVisible('span')
});

assert.ok(page.spanIsVisible);
```

```javascript
// <span>ipsum</span>
// <span style="display:none">dolor</span>

const page = PageObject.create({
  spansAreVisible: PageObject.isVisible('span', { multiple: true })
});

// not all spans are visible
assert.notOk(page.spansAreVisible);
```

```javascript
// <span>ipsum</span>
// <span>dolor</span>

const page = PageObject.create({
  spansAreVisible: PageObject.isVisible('span', { multiple: true })
});

// all spans are visible
assert.ok(page.spansAreVisible);
```

```javascript
// Lorem <strong>ipsum</strong>

const page = PageObject.create({
  spanIsVisible: PageObject.isVisible('span')
});

// returns false when element doesn't exist in DOM
assert.notOk(page.spanIsVisible);
```

```javascript
// <div>
//   <span style="display:none">lorem</span>
// </div>
// <div class="scope">
//   <span>ipsum</span>
// </div>

const page = PageObject.create({
  spanIsVisible: PageObject.isVisible('span', { scope: '.scope' })
});

assert.ok(page.spanIsVisible);
```

```javascript
// <div>
//   <span style="display:none">lorem</span>
// </div>
// <div class="scope">
//   <span>ipsum</span>
// </div>

const page = PageObject.create({
  scope: '.scope',
  spanIsVisible: PageObject.isVisible('span')
});

assert.ok(page.spanIsVisible);
```

Returns **Descriptor** 
{% endraw %}