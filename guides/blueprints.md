---
layout: guide
title: Blueprints
---

ember-cli-page-object includes some useful blueprints to automate the creation of page objects.

## `page-object` blueprint

Usage: `ember generate page-object users`

Creates a new page object in `tests/pages/users.js`. You can also generate the page object in a subfolder `ember generate page-object users/index`.

## `page-object-component` blueprint

Usage: `ember generate page-object-component navbar`

Generates a component object to be used on a page object in `tests/pages/components/navbar.js`. You can use this component from a page object by importing it.

```js
import {
  create,
  visitable
} from 'ember-cli-page-object';
import navbar from './components/navbar';

export default create({
  visit: visitable('/'),

  navbar: navbar
});
```

_Note that we're using the name `component` in the context of page objects, don't be confused with Ember.Component._

## `page-object-helper` blueprint

Usage: `ember generate page-object helper is-disabled`

Generates a helper to be used on a page object in
`tests/pages/helpers/is-disabled.js`. You can use this helper from a page object
by importing it.

```js
import {
  create,
  visitable
} from 'ember-cli-page-object';
import isDisabled from './helpers/is-disabled';

export default create({
  visit: visitable('/'),

  isDisabled: isDisabled('.foo-bar')
});
```
