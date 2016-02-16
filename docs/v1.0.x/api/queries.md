---
layout: page
title: Queries
---

- [attribute](#attribute)
- [collection](#collection)
- [count](#count)
- [text](#text)
- [value](#value)

## attribute

[test-support/page-object/queries/attribute.js:66-81](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/queries/attribute.js#L66-L81 "Source code on GitHub")

Gets the value of an attribute from matched element or Array of value of
attributes of multiple matched elements

**Parameters**

-   `attributeName` **string** Name of the attribute to get
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values

**Examples**

```javascript
// <input placeholder="a value">

var page = PageObject.create({
  inputPlaceHolder: PageObject.attribute('placeholder', 'input')
});

assert.equal(page.inputPlaceHolder, 'a value');
```

```javascript
// <input placeholder="a value">
// <input placeholder="other value">

let page = PageObject.create({
  inputPlaceHolder: PageObject.attribute('placeholder', ':input', { multiple: true })
});

assert.equal(page.inputPlaceHolder, ['a value', 'other value']);
```

```javascript
// <div><input></div>
// <div class="scope"><input placeholder="a value"></div>
// <div><input></div>

let page = PageObject.create({
  inputPlaceHolder: PageObject.attribute('placeholder', ':input', { scope: '.scope' })
});

assert.equal(page.inputPlaceHolder, 'a value');
```

```javascript
// <div><input></div>
// <div class="scope"><input placeholder="a value"></div>
// <div><input></div>

let page = PageObject.create({
  scope: 'scope',
  inputPlaceHolder: PageObject.attribute('placeholder', ':input')
});

assert.equal(page.inputPlaceHolder, 'a value');
```

Returns **Descriptor** 

## collection

[test-support/page-object/queries/collection.js:138-150](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/queries/collection.js#L138-L150 "Source code on GitHub")

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

## count

[test-support/page-object/queries/count.js:73-85](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/queries/count.js#L73-L85 "Source code on GitHub")

Gets the count of elements matched by selector

**Parameters**

-   `selector` **string** CSS selector of the element or elements to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Add scope
    -   `options.resetScope` **boolean** Ignore parent scope

**Examples**

```javascript
// <span>1</span>
// <span>2</span>

var page = PageObject.create({
  spanCount: PageObject.count('span')
});

assert.equal(page.spanCount, 2);
```

```javascript
// <div>Text</div>

var page = PageObject.create({
  spanCount: PageObject.count('span')
});

assert.equal(page.spanCount, 0);
```

```javascript
// <div><span></span></div>
// <div class="scope"><span></span><span></span></div>

var page = PageObject.create({
  spanCount: PageObject.count('span', { scope: '.scope' })
});

assert.equal(page.spanCount, 2)
```

```javascript
// <div><span></span></div>
// <div class="scope"><span></span><span></span></div>

var page = PageObject.create({
  scope: '.scope',
  spanCount: PageObject.count('span')
});

assert.equal(page.spanCount, 2)
```

```javascript
// <div><span></span></div>
// <div class="scope"><span></span><span></span></div>

var page = PageObject.create({
  scope: '.scope',
  spanCount: PageObject.count('span', { resetScope: true })
});

assert.equal(page.spanCount, 1);
```

Returns **Descriptor** 

## text

[test-support/page-object/queries/text.js:67-82](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/queries/text.js#L67-L82 "Source code on GitHub")

Gets text of the element or Array of texts of all matched elements by selector

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Return an array of values

**Examples**

```javascript
// Hello <span>world!</span>

let page = PageObject.create({
  text: PageObject.text('span')
});

assert.equal(page.text, 'world!');
```

```javascript
// <span>lorem</span>
// <span> ipsum </span>
// <span>dolor</span>

var page = PageObject.create({
  texts: PageObject.text('span', { multiple: true })
});

assert.equal(page.texts, ['lorem', 'ipsum', 'dolor']);
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

let page = PageObject.create({
  text: PageObject.text('span', { scope: '.scope' })
});

assert.equal(page.text, 'ipsum');
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

let page = PageObject.create({
  scope: '.scope',
  text: PageObject.text('span')
});

// returns 'ipsum'
assert.equal(page.text, 'ipsum');
```

Returns **Descriptor** 

## value

[test-support/page-object/queries/value.js:63-78](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/queries/value.js#L63-L78 "Source code on GitHub")

Gets the value of matched element or get Array of values of all matched elements

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values

**Examples**

```javascript
// <input value="Lorem ipsum">

var page = PageObject.create({
  value: PageObject.value('input')
});

assert.equal(page.value, 'Lorem ipsum');
```

```javascript
// <input value="lorem">
// <input value="ipsum">

let page = PageObject.create({
  value: PageObject.value('input', { multiple: true })
});

assert.equal(page.value, ['lorem', 'ipsum']);
```

```javascript
// <div><input value="lorem"></div>
// <div class="scope"><input value="ipsum"></div>

let page = PageObject.create({
  value: PageObject.value('input', { scope: '.scope' })
});

assert.equal(page.value, 'ipsum');
```

```javascript
// <div><input value="lorem"></div>
// <div class="scope"><input value="ipsum"></div>

let page = PageObject.create({
  scope: '.scope',
  value: PageObject.value('input')
});

assert.equal(page.value, 'ipsum');
```

Returns **Descriptor** 
