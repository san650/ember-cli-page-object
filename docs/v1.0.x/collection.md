---
layout: page
title: Collection
---

- [collection](#collection)

## collection

[test-support/page-object/collection.js:138-150](https://github.com/san650/ember-cli-page-object/blob/7c7692018d45135b1322e2f58834c61a3ce216d7/test-support/page-object/collection.js#L138-L150 "Source code on GitHub")

Creates a component that represents a collection of items, the collection is zero-indexed

The collection component behaves as a regular PageObject when called without index (parens needed)

**Parameters**

-   `definition` **Object** Collection definition
    -   `definition.scope` **string** Nests provided scope with parent's scope
    -   `definition.resetScope` **boolean** Override parent's scope
    -   `definition.itemScope` **String** CSS selector
    -   `definition.item` **Object** Item definition

**Examples**

```javascript
// <table>
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

var page = PageObject.create({
  users: collection({
    itemScope: 'table tr',

    item: {
      firstName: text('td', { at: 0 })
      lastName: text('td', { at: 1 })
    }
  })
});

assert.equal(page.users().count, 2);
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

var page = PageObject.create({
  users: collection({
    scope: '.admins',

    itemScope: 'table tr',

    item: {
      firstName: text('td', { at: 0 })
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

var page = PageObject.create({
  users: PageObject.collection({
    scope: 'table',
    itemScope: 'tr',

    item: {
      firstName: text('td', { at: 0 })
    },

    caption: PageObject.text('caption')
  })
});

assert.equal(page.users().caption, "User Index");
```

Returns **Descriptor** 
