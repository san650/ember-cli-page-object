---
layout: page
title: Is
---

{% raw %}
### Methods

- [is](#is)

## is

[addon/-private/properties/is.js:45-62](https://github.com/san650/ember-cli-page-object/blob/f70ce5d253619a25948ed1de7c34cb3f3978c953/addon/-private/properties/is.js#L45-L62 "Source code on GitHub")

**Parameters**

-   `testSelector` **string** CSS selector to test
-   `targetSelector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
    -   `options.testContainer` **string** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <input type="checkbox" checked="checked">
// <input type="checkbox" checked>

const page = PageObject.create({
  areInputsChecked: is(':checked', 'input', { multiple: true })
});

assert.equal(page.areInputsChecked, true, 'Inputs are checked');
```

```javascript
// <button class="toggle-button active" disabled>Toggle something</button>

const page = PageObject.create({
  isToggleButtonActive: is('.active:disabled', '.toggle-button')
});

assert.equal(page.isToggleButtonActive, true, 'Button is active');
```

Returns **Descriptor** 
{% endraw %}