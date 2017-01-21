---
layout: api
title: Fillable
---

{% raw %}
### Methods

- [fillable](#fillable)
- [selectable](#selectable)

## fillable

[addon/-private/properties/fillable.js:107-148](undefined/blob/fffa214390f41841c5e104729fb459d2cb25b5e9/addon/-private/properties/fillable.js#L107-L148 "Source code on GitHub")

Fills in an input matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.testContainer` **String** Context where to search elements in the DOM

**Examples**

```javascript
// <input value="">

const page = PageObject.create({
  fillIn: PageObject.fillable('input')
});

// result: <input value="John Doe">
page.fillIn('John Doe');
```

```javascript
// <div class="name">
//   <input value="">
// </div>
// <div class="last-name">
//   <input value= "">
// </div>

const page = PageObject.create({
  fillInName: PageObject.fillable('input', { scope: '.name' })
});

page.fillInName('John Doe');

// result
// <div class="name">
//   <input value="John Doe">
// </div>
```

```javascript
// <div class="name">
//   <input value="">
// </div>
// <div class="last-name">
//   <input value= "">
// </div>

const page = PageObject.create({
  scope: 'name',
  fillInName: PageObject.fillable('input')
});

page.fillInName('John Doe');

// result
// <div class="name">
//   <input value="John Doe">
// </div>
```

```javascript
<caption>Filling different inputs with the same property</caption>

// <input id="name">
// <input name="lastname">
// <input data-test="email">
// <textarea aria-label="address">
// <input placeholder="phone">

const page = create({
  fillIn: fillable('input')
});

page
  .fillIn('name', 'Doe')
  .fillIn('lastname', 'Doe')
  .fillIn('email', 'john@doe')
  .fillIn('address', 'A street')
  .fillIn('phone', '555-000');
```

Returns **Descriptor** 

## selectable

[addon/-private/properties/fillable.js:107-148](undefined/blob/fffa214390f41841c5e104729fb459d2cb25b5e9/addon/-private/properties/fillable.js#L107-L148 "Source code on GitHub")

Alias for `fillable`, which works for inputs and HTML select menus.

[See `fillable` for usage examples.](#fillable)

**Parameters**

-   `selector` **string** CSS selector of the element to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.testContainer` **String** Context where to search elements in the DOM

Returns **Descriptor** 
{% endraw %}
