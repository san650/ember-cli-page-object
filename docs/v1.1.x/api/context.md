---
layout: api
title: Context
---

{% raw %}
### Methods

- [removeContext](#removecontext)
- [render](#render)
- [setContext](#setcontext)

## removeContext

[test-support/page-object/context.js:63-69](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/context.js#L63-L69 "Source code on GitHub")

Unsets the page's test context.

Useful in a component test's `afterEach()` hook, to make sure the context has been cleared after each test.

**Examples**

```javascript
page.removeContext();
```

Returns **PageObject** the page object

## render

[test-support/page-object/context.js:17-28](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/context.js#L17-L28 "Source code on GitHub")

Render a component's template in the context of a test.

Throws an error if a test's context has not been set on the page.

Returns the page object, which allows for method chaining.

**Parameters**

-   `template` **Object** A compiled component template

**Examples**

```javascript
page.setContext(this)
  .render(hbs`{{my-component}}`)
  .clickOnText('Hi!');
```

Returns **PageObject** the page object

## setContext

[test-support/page-object/context.js:44-50](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/context.js#L44-L50 "Source code on GitHub")

Sets the page's test context.

Returns the page object, which allows for method chaining.

**Parameters**

-   `context` **Object** A component integration test's `this` context

**Examples**

```javascript
page.setContext(this)
  .render(hbs`{{my-component}}`)
  .clickOnText('Hi!');
```

Returns **PageObject** the page object
{% endraw %}
