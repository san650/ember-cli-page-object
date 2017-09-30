---
layout: page
title: Alias
---

{% raw %}
### Methods

- [alias](#alias)

## alias

[addon/-private/properties/alias.js:81-103](https://github.com/san650/ember-cli-page-object/blob/eeba8e285bd3a52c66ab6d2979f23b64bf9235fd/addon/-private/properties/alias.js#L81-L103 "Source code on GitHub")

Returns the value of some other property on the PageObject.

**Parameters**

-   `pathToProp` **string** dot-separated path to a property specified on the PageObject
-   `options` **Object**
    -   `options.chainable` **Boolean** when this is true, an aliased
        method returns the PageObject node on which the alias is defined, rather
        than the PageObject node on which the aliased property is defined.

**Examples**

```javascript
import { create } from 'ember-cli-page-object';
import { alias } from 'ember-cli-page-object/macros';

const page = create({
  submitButton: {
    scope: '.submit-button'
  },
  submit: alias('submitButton.click')
});

// calls `page.submitButton.click`
page.submit();
```

```javascript
import { create } from 'ember-cli-page-object';
import { alias } from 'ember-cli-page-object/macros';

const page = create({
  submitButton: {
    scope: '.submit-button'
  },
  isSubmitButtonVisible: alias('submitButton.isVisible')
});

// checks value of `page.submitButton.isVisible`
assert.ok(page.isSubmitButtonVisible);
```

```javascript
import { create } from 'ember-cli-page-object';
import { alias } from 'ember-cli-page-object/macros';

const page = create({
  form: {
    input: {
      scope: 'input'
    },
    submitButton: {
      scope: '.submit-button'
    }
  },
  fillFormInput: alias('form.input.fillIn', { chainable: true }),
  submitForm: alias('form.submitButton.click', { chainable: true })
});

// executes `page.form.input.fillIn` then `page.form.submitButton.click`
// and causes both methods to return `page` (instead of `page.form.input`
// and `page.form.submitButton` respectively) so that the aliased methods
// can be chained off `page`.
page
  .fillFormInput('foo')
  .submitForm();
```

Returns **Descriptor**
{% endraw %}