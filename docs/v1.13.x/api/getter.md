---
layout: page
title: Getter
---

{% raw %}
### Methods

- [getter](#getter)

## getter

[addon/-private/properties/getter.js:46-58](https://github.com/san650/ember-cli-page-object/blob/f70ce5d253619a25948ed1de7c34cb3f3978c953/addon/-private/properties/getter.js#L46-L58 "Source code on GitHub")

Creates a Descriptor whose value is determined by the passed-in function.
The passed-in function must not be bound and must not be an arrow function,
as this would prevent it from running with the correct context.

**Parameters**

-   `fn` **Function** determines what value is returned when the Descriptor is accessed

**Examples**

```javascript
// <input type="text">
// <button disabled>Submit</button>

import { create } from 'ember-cli-page-object';
import { getter } from 'ember-cli-page-object/macros';

const page = create({
  inputValue: value('input'),
  isSubmitButtonDisabled: property('disabled', 'button'),

  // with the `getter` macro
  isFormEmpty: getter(function() {
    return !this.inputValue && this.isSubmitButtonDisabled;
  }),

  // without the `getter` macro
  _isFormEmpty: {
    isDescriptor: true,
    get() {
      return !this.inputValue && this.isSubmitButtonDisabled;
    }
  }
});

// checks the value returned by the function passed into `getter`
assert.ok(page.isFormEmpty);
```

Returns **Descriptor** 
{% endraw %}