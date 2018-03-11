---
layout: page
title: Native Events Mode
---

{% raw %}
By default, `ember-cli-page-object` uses global ember test helpers such as `click`, `fillIn`, `find`, etc.
While it works great, this approach has one downside: global ember test helpers require `jQuery` to be bundled within your `Ember` global.

As a result, if you want to drop a dependency on `jQuery` in your app or addon, you won't be able to use the standard `Ember` test helpers.

In order to solve this problem, `ember-cli-page-object` provides an integration with [`ember-native-dom-helpers`](https://github.com/cibernox/ember-native-dom-helpers).

In general, `native-events` mode doesn't require you to rewrite your existing page object declarations. However, you should take into account that with `native-events` mode enabled, your test suite triggers real DOM events instead of `jQuery` alternatives.

## Usage

You can enable `native-events` mode by simply adding this snippet into your `test-helper.js`:

```js
// tests/test-helper.js
import { useNativeEvents } from 'ember-cli-page-object/extend';
...

useNativeEvents();
```

## Migration from jQuery events to native DOM events

If you want to use `native-events` mode in your test suite, you have to ensure that your app is ready to handle native DOM events rather than jQuery events.

Consider a component event handler like this:

```js
export default Component.extend({
  doubleClick() {
    set(this, "doubleClicked", true);
    return true;
  }
})
```

`native-events` mode won't work out of the box with a handler like this. The native double-click won't have any effect on the component because Ember's event dispatcher handles events via jQuery.

In order to fix this, you should replace the default event dispatcher with `ember-native-dom-event-dispatcher`:

```sh
npm i --save-dev ember-native-dom-event-dispatcher
```

{% endraw %}
