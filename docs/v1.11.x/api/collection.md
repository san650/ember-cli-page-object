---
layout: page
title: Collection
---

{% raw %}
### Methods

- [collection](#collection)

## collection

[addon/-private/properties/collection.js:215-242](https://github.com/san650/ember-cli-page-object/blob/0f20135d16179278eb6fec7b04b505be79f096ef/addon/-private/properties/collection.js#L215-L242 "Source code on GitHub")

**Parameters**

-   `definition` **Object** Collection definition
    -   `definition.scope` **string** Nests provided scope within parent's scope
    -   `definition.resetScope` **boolean** Override parent's scope
    -   `definition.itemScope` **string** CSS selector
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