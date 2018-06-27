---
layout: page
title: Query-Options
---

You can adjust component query selector with the following options:

* [scope](#scope)
* [resetScope](#resetScope)
* [testContainer](#testContainer)
* [multiple](#multiple)
* [at](#at)

## scope

The `scope` option can be used to do nesting of the provided selector
within the inherited scope.

Given the following HTML

```html
<div class="page">
  <div class="article">
    <p>Lorem ipsum dolor</p>
  </div>
  <div class="footer">
    <p>Copyright 2016 - Acme Inc.</p>
  </div>
</div>
```

the following configuration will match the footer element

```js
const page = create({
  scope: '.page',

  copyrightNotice: {
    scope: '.footer'
  }
});

assert.equal(page.copyrightNotice.text, 'Copyright 2015 - Acme Inc.');
```

## resetScope

A parent scope can be reseted by setting a `resetScope` attribute:

```js
import { create } from 'ember-cli-page-object';

const form = create({
  scope: '.MyForm',

  dialog: {
    scope: '.SomeDialog',

    resetScope: true
  }
});

await form.clickOn('Cancel');

assert.ok(form.dialog.isVisible);
```

## testContainer

Sometimes components may render outside of standard test container which defaults to `#ember-testing`. In such cases you can specify a custom query root element:

```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  scope: '.scope',
  modal: {
    scope: '.Modal',
    testContainer: 'body'
  }
});

assert.ok(page.modal.contains('Lorem')); 
```

## multiple

By default, element lookup will throw an error if more than on element
is matched. Setting the `multiple` option will override this behavior:

```html
<span>Lorem</span>
<span>ipsum</span>
```

```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  words: text('span', { multiple: true })
});

andThen(function() {
  assert.deepEqual(page.word, ['Lorem', 'ipsum']); // => ok
});
```

The return value of each property using the `multiple` option can be
found in the API documentation.

## at

The `at` option can be used to reduce the set of matched elements to the one at the specified index (starting from zero).

```html
<span>Lorem</span>
<span>ipsum</span>
<span>dolor</span>
```

the following configuration will match the second `span` element

```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  word: text('span', { at: 1 })
});

andThen(function() {
  assert.equal(page.word, 'ipsum'); // => ok
});
```
