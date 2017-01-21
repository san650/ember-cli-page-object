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

[addon/-private/context.js:69-75](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/context.js#L69-L75 "Source code on GitHub")

**Examples**

```javascript
page.removeContext();
```

Returns **PageObject** the page object

## render

[addon/-private/context.js:19-30](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/context.js#L19-L30 "Source code on GitHub")

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

[addon/-private/context.js:48-54](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/context.js#L48-L54 "Source code on GitHub")

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