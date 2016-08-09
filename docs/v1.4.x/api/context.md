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

[addon/context.js:63-69](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/context.js#L63-L69 "Source code on GitHub")

Unsets the page's test context.

Useful in a component test's `afterEach()` hook, to make sure the context has been cleared after each test.

**Examples**

```javascript
page.removeContext();
```

Returns **PageObject** the page object

## render

[addon/context.js:17-28](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/context.js#L17-L28 "Source code on GitHub")

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

[addon/context.js:44-50](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/context.js#L44-L50 "Source code on GitHub")

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
