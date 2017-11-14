---
layout: page
title: Native DOM Helpers
---

{% raw %}
By default `ember-cli-page-object` uses global ember test helpers such as `click`, `fillIn`, `find`, etc.
While it works great this approach has one downside: global ember test helpers require `jQuery` to be bundled within your `Ember` global.

As a result if you want to drop a dependency on `jQuery` in your app or addon you won't be able to use standard `Ember` test helpers.

In order to solve this problem `ember-cli-page-object` provides an integration with [`ember-native-dom-helpers`](https://github.com/cibernox/ember-native-dom-helpers).

In general `native-dom` mode doesn't require you to re-write your existing page object declarations if you don't use `jQuery` directly there. However you should take into account that with `native-dom` mode enabled your test suite starts to trigger a real DOM events instead of `jQuery` alternatives.

## Usage

You can enable `native-dom` mode by simply adding this snippet into your `test-helper.js`:

```js
// tests/test-helper.js
import { useNativeDOMHelpers } from 'ember-cli-page-object/extend';
...

useNativeDOMHelpers();
```

## Migration from jQuery events to native DOM events

### Ember built-in event handlers

If you have defined event handler hooks in your components, like that:

```js
export default Component.extend({
    doubleClick() {
        set(this, "doubleClicked", true);
        return true;
    }
})
```

It won't work out of the box with native events mode. 
It happens because by default Ember's event dispatcher handles events via jquery.

In order to fix this you should replace default event dispatcher with `ember-native-dom-event-dispatcher`:

```sh
npm i --save-dev ember-native-dom-event-dispatcher
```

{% endraw %}
