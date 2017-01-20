---
layout: page
title: Visitable
---

{% raw %}
### Methods

- [visitable](#visitable)

## visitable

[addon/-private/properties/visitable.js:85-104](undefined/blob/fffa214390f41841c5e104729fb459d2cb25b5e9/addon/-private/properties/visitable.js#L85-L104 "Source code on GitHub")

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
