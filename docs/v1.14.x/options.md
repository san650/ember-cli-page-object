---
layout: page
title: Options
---

A set of options can be passed as parameters when defining attributes.

* [scope](#scope)
* [at](#at)
* [resetScope](#resetScope)
* [multiple](#multiple)

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
const { create, text } from 'ember-cli-page-object';

const page = create({
  scope: '.page',

  copyrightNotice: text('p', { scope: '.footer' })
});

andThen(function() {
  assert.equal(page.copyrightNotice, 'Copyright 2015 - Acme Inc.');
});
```

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

## resetScope

Used with the `scope` options, the 'resetScope' option is meant to
override the inherited scope of a component or property with the
value defined on the `scope` property.

```html
<div class="scope">
  <span>ipsum</span>
  <span>dolor</span>
</div>
<div class="outside-scope">
  <span>Lorem</span>
</div>
```

```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  scope: '.scope',
  outsideWord: text('span', { scope: 'outside-scope', resetScope: true })
});

andThen(function() {
  assert.equal(page.outsideWord, 'Lorem'); // => ok
});
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
