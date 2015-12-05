---
layout: page
title: Setup
permalink: /api/setup/
---

You can import the PageObject object using the `import` construct as follows:

```js
import PageObject from '../page-object';
```

The previous example assumes that your test file is one level deep under
`tests/` folder. i.e. `tests/unit/my-unit-test.js`.


In order to create a new PageObject definition use the `.create` method.

```js
var page = PageObject.create({
  // page attributes
});
```

You can define attributes using any JavaScript construct

```js
var page = PageObject.create({
  title: function() {
    return $('.title').text();
  },

  text: 'A text'
});

assert.equal(page.title(), 'My title');
assert.equal(page.text, 'A text');
```

There are many special attributes you can use defined under the PageObject namespace
that simplify common patterns, i.e.

```js
var page = PageObject.create({
  title: PageObject.text('.title')
});
```

The following is a comprehensive documentation of the available `PageObject` attribute
helpers.
