---
layout: page
title: Visitable
---

{% raw %}
### Methods

- [visitable](#visitable)

## visitable

[addon/-private/properties/visitable.js:85-104](https://github.com/san650/ember-cli-page-object/blob/0f20135d16179278eb6fec7b04b505be79f096ef/addon/-private/properties/visitable.js#L85-L104 "Source code on GitHub")

**Parameters**

-   `path` **string** Full path of the route to visit

**Examples**

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users')
});

// visits '/users'
page.visit();
```

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users/:user_id')
});

// visits '/users/10'
page.visit({ user_id: 10 });
```

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users')
});

// visits '/users?name=john'
page.visit({ name: 'john' });
```

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users/:user_id')
});

// visits '/users/1?name=john'
page.visit({ user_id: 1, name: 'john' });
```

Returns **Descriptor** 
{% endraw %}