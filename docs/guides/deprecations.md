---
layout: page
title: Deprecations
---

This is a list of deprecations introduced in 2.x cycle:

## Find element

**ID**: ember-cli-page-object.find-element

**Until**: 3.0.0

Both `findElement(` and `findElementWithAssert()` have jQuery collection as their return value. Since we are going away from jQuery usage, these two finders are deprecated now.

Please consider using `findOne(` or `findMany(` instead.

Bad:

```js
import { getter } from 'ember-cli-page-object/macros';
import { findElementWithAssert } from 'ember-cli-page-object/extend';

export default function isDisabled(selector, options = {}) {
  return getter(function() {
    return findElementWithAssert(this, selector, options).is(':disabled');
  });
}
```

Good:

```js
import { getter } from 'ember-cli-page-object/macros';
import { findOne } from 'ember-cli-page-object/extend';

export default function isDisabled(selector, options = {}) {
  return getter(function() {
    return findOne(this, selector, options).disabled;
  });
}

```

Bad:

```js
import { getter } from 'ember-cli-page-object/macros';
import { findElement } from 'ember-cli-page-object/extend';

export default function count(selector, options = {}) {
  return getter(function() {
    return findElement(this, selector, {
      ...options,
      multiple: true
    }).length;
  });
}
```

Good:

```js
import { getter } from 'ember-cli-page-object/macros';
import { findMany } from 'ember-cli-page-object/extend';

export default function count(selector, options = {}) {
  return getter(function() {
    return findMany(this, selector, options).length;
  });
}
```
