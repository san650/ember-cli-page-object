---
layout: page
title: Count
---

{% raw %}
### Methods

- [count](#count)

## count

[addon/-private/properties/count.js:74-89](https://github.com/san650/ember-cli-page-object/blob/0f20135d16179278eb6fec7b04b505be79f096ef/addon/-private/properties/count.js#L74-L89 "Source code on GitHub")

**Parameters**

-   `selector` **string** CSS selector of the element or elements to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Add scope
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

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
{% endraw %}