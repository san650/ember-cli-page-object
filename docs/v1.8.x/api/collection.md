---
layout: api
title: Collection
---

{% raw %}
### Methods

- [collection](#collection)

## collection

[addon/-private/properties/collection.js:205-231](undefined/blob/fffa214390f41841c5e104729fb459d2cb25b5e9/addon/-private/properties/collection.js#L205-L231 "Source code on GitHub")

**Parameters**

-   `definition` **Object** Collection definition
    -   `definition.scope` **string** Nests provided scope within parent's scope
    -   `definition.resetScope` **boolean** Override parent's scope
    -   `definition.itemScope` **String** CSS selector
    -   `definition.item` **Object** Item definition

**Examples**

```javascript
// <table>
//   <caption>List of users</caption>
//   <tbody>
//     <tr>
//       <td>Mary<td>
//       <td>Watson</td>
//     </tr>
//     <tr>
//       <td>John<td>
//       <td>Doe</td>
//     </tr>
//   </tbody>
// </table>

const page = PageObject.create({
  users: collection({
    itemScope: 'table tr',

    item: {
      firstName: text('td', { at: 0 }),
      lastName: text('td', { at: 1 })
    },

    caption: text('caption')
  })
});

assert.equal(page.users().count, 2);
assert.equal(page.users().caption, 'List of users');
assert.equal(page.users(1).firstName, 'John');
assert.equal(page.users(1).lastName, 'Doe');
```

```javascript
// <div class="admins">
//   <table>
//     <tbody>
//       <tr>
//         <td>Mary<td>
//         <td>Watson</td>
//       </tr>
//       <tr>
//         <td>John<td>
//         <td>Doe</td>
//       </tr>
//     </tbody>
//   </table>
// </div>

// <div class="normal">
//   <table>
//   </table>
// </div>

const page = PageObject.create({
  users: collection({
    scope: '.admins',

    itemScope: 'table tr',

    item: {
      firstName: text('td', { at: 0 }),
      lastName: text('td', { at: 1 })
    }
  })
});

assert.equal(page.users().count, 2);
```

```javascript
// <table>
//   <caption>User Index</caption>
//   <tbody>
//     <tr>
//       <td>Doe</td>
//     </tr>
//   </tbody>
// </table>

const page = PageObject.create({
  users: PageObject.collection({
    scope: 'table',
    itemScope: 'tr',

    item: {
      firstName: text('td', { at: 0 })
    },

    caption: PageObject.text('caption')
  })
});

assert.equal(page.users().caption, 'User Index');
```

Returns **Descriptor** 
{% endraw %}
