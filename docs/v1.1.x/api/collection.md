---
layout: api
title: Collection
---

{% raw %}
### Methods

- [collection](#collection)

## collection

[test-support/page-object/collection.js:140-152](https://github.com/san650/ember-cli-page-object/blob/fbc76e9109d2f5ce0729fcda7f18959f3ef6fa0e/test-support/page-object/collection.js#L140-L152 "Source code on GitHub")

Creates a component that represents a collection of items. The collection is zero-indexed.

Collections have a `count` property that returns the number of elements in the collection.

The collection returned by the collection method behaves as a regular PageObject when called without an index.

When called with an index, the method returns the matching item.

**Parameters**

-   `definition` **Object** Collection definition
    -   `definition.scope` **string** Nests provided scope within parent's scope
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

const page = PageObject.create({
  users: collection({
    itemScope: 'table tr',

    item: {
      firstName: text('td', { at: 0 }),
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
