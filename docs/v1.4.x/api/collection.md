---
layout: page
title: Collection
---

{% raw %}
### Methods

- [collection](#collection)

## collection

[addon/collection.js:201-215](undefined/blob/f6764e1741c7d2964c1cba26ae375c672ad45d02/addon/collection.js#L201-L215 "Source code on GitHub")

Creates a component that represents a collection of items. The collection is zero-indexed.

When called with an index, the method returns the matching item.

When called without an index, the the object returned behaves as a regular PageObject with a few additional properties and methods:

-   `count` - the number of items in the collection
-   `toArray()` - returns an array containing all the items in the collection
-   `[Symbol.iterator]()` - if supported by the environment, this allows the collection to be iterated with `for/of` and spread with `...` like a normal array

Collection objects also delegate the following methods to `toArray()` for ease of consumption:

-   `map`
-   `mapBy`
-   `filter`
-   `filterBy`

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