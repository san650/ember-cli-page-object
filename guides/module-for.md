---
layout: page
title: Using "moduleFor" test helpers
---
{% raw %}

EmberCLI Page Object allows you to re-use your page objects across different test types or different test-helpers implementations without a need to change your definitions.

While there is no special sauce needed for `moduleForAcceptance` test helper there are some caveats you should be aware of if you are using a `moduleForComponent`.

When using a `moduleForComponent` test helper we need to tell the page object to use the test’s `this.$()` to find elements. There is a `setContext` method on page object instance for that. We also need to `removeContext` after the test is finished to avoid side effects in the following tests:

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import page from 'project-name/tests/pages/my-page';

moduleForComponent('AwesomeList', 'Integration | My Component', {
  integration: true,

  beforeEach() {
    page.setContext(this);
  },

  afterEach() {
    page.removeContext();
  }
});

test('it renders', function(assert) {
  render(`{{my-component}}`);

  assert.ok(page.isVisible);
}
```
{% endraw %}
