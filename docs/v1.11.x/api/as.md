---
layout: page
title: As
---

{% raw %}
### Methods

- [as](#as)

## as

[addon/-private/properties/as.js:49-52](https://github.com/san650/ember-cli-page-object/blob/0f20135d16179278eb6fec7b04b505be79f096ef/addon/-private/properties/as.js#L49-L52 "Source code on GitHub")

**Parameters**

-   `callback` **function** Function to be called with the current object as the parameter

**Examples**

```javascript
andThen(() => {
  page.users(1).as(user => {
    assert.equal(user.name, 'John');
    assert.equal(user.lastName, 'Doe');
    assert.equal(user.email, 'john@doe');
  });

  page.users(2).as(user => {
    assert.equal(user.name, 'John');
    assert.equal(user.lastName, 'Doe');
    assert.equal(user.email, 'john@doe');
  });

  page.users(3).as(user => {
    assert.equal(user.name, 'John');
    assert.equal(user.lastName, 'Doe');
    assert.equal(user.email, 'john@doe');
  });
});
```

```javascript
// Lorem <span>ipsum <strong>dolor</strong></span>

let page = create({
  scope: 'span',
  foo: {
    bar: {
      scope: 'strong'
    }
  }
});

page.foo.bar.as(element => {
  assert.equal(element.text, 'dolor');
});
```

Returns **object** this
{% endraw %}