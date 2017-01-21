---
layout: api
title: Is
---

{% raw %}
### Methods

- [is](#is)

## is

[addon/-private/properties/is.js:45-62](undefined/blob/fffa214390f41841c5e104729fb459d2cb25b5e9/addon/-private/properties/is.js#L45-L62 "Source code on GitHub")

**Parameters**

-   `testSelector` **string** CSS selector to test
-   `targetSelector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
    -   `options.testContainer` **String** Context where to search elements in the DOM

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
