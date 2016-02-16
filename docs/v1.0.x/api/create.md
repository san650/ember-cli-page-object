---
layout: page
title: Create
---

- [buildObject](#buildobject)
- [create](#create)

## buildObject

[test-support/page-object/create.js:42-52](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/create.js#L42-L52 "Source code on GitHub")

See <https://github.com/san650/ceibo#examples> for more info on how Ceibo
builders work.

**Parameters**

-   `builder`  
-   `target`  
-   `key`  
-   `definition`  

## create

[test-support/page-object/create.js:98-104](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/create.js#L98-L104 "Source code on GitHub")

Creates a new PageObject

By default, the result PageObject will respond to a default set of options: click, clickOn,
contains, isHidden, isVisible and text.

**Parameters**

-   `definition` **Object** PageObject definition
-   `options` **Object** [private] Ceibo options. Do not use!

**Examples**

```javascript
// <div class="title">My title</div>

var page = PageObject.create({
  title: PageObject.text('.title')
});

assert.equal(page.title, 'My title');
```

```javascript
// <div id="my-page">
//  My super text
//  <button> Press Me</button>
// </div>

var page = PageObject.create({
  scope: '#my-page',
});

assert.equal(page.text, 'My super text');
assert.ok(page.isVisible);
assert.ok(!page.isHidden);
assert.ok(page.contains('super'));

// clicks div#my-page
page.click

// clicks button
page.clickOn('Press Me');
```

Returns **PageObject** 
