---
layout: page
title: Predicates
permalink: /api/predicates/
---

Test conditions on elements

* [.hasClass](#hasclass)
* [.notHasClass](#nothasclass)
* [.isVisible](#isvisible)
* [.isHidden](#ishidden)
* [.contains](#contains)

### .hasClass

Returns `true` if the element has the css class.

Attribute signature

```js
PageObject.hasClass(cssClass, selector [, scope: ''])
```

Examples

```html
<img class="img is-active" src="...">
```

```js
var page = PageObject.create({
  isImageActive: PageObject.hasClass('is-active', '.img')
});

assert.ok(page.isImageActive(), 'Image is active');
```

### .notHasClass

Returns `true` if the element doesn't have the css class.

Attribute signature

```js
PageObject.notHasClass(cssClass, selector [, scope: ''])
```

Examples

```html
<img class="img is-active" src="...">
```

```js
var page = PageObject.create({
  isImageDeactivated: PageObject.notHasClass('is-active', '.img')
});

assert.ok(page.isImageDeactivated(), 'Image is not active');
```

### .isVisible

Returns `true` if the element exists and is visible.

Attribute signature

```js
PageObject.isVisible(selector [, scope: ''])
```

Examples

```html
<img class="img" src="...">
```

```js
var page = PageObject.create({
  isImageVisible: PageObject.isVisible('.img')
});

assert.ok(page.isImageVisible(), 'Image is visible');
```

### .isHidden

Returns `true` if the element doesn't exist or it exists and is hidden.

Attribute signature

```js
PageObject.isHidden(selector [, scope: ''])
```

Examples

```html
<img class="img" style="display:none" src="...">
```

```js
var page = PageObject.create({
  isImageHidden: PageObject.isHidden('.img')
});

assert.ok(page.isImageHidden(), 'Image is hidden');
```

### .contains

Returns `true` if the given text is found within element's text.

Attribute signature

```js
PageObject.contains(selector [, scope: ''])
```

Examples

```html
<h1> Page Title </h1>
```

```js
var page = PageObject.create({
  titleIncludes: contains('h1')
});

assert.ok(page.titleIncludes('Page'));
```
