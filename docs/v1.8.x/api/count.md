---
layout: api
title: Count
---

{% raw %}
### Methods

- [count](#count)

## count

[addon/-private/properties/count.js:74-89](undefined/blob/fffa214390f41841c5e104729fb459d2cb25b5e9/addon/-private/properties/count.js#L74-L89 "Source code on GitHub")

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
{% endraw %}
