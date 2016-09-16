---
layout: page
title: Properties
---

{% raw %}
### Methods

- [attribute](#attribute)
- [clickOnText](#clickontext)
- [clickable](#clickable)
- [collection](#collection)
- [contains](#contains)
- [count](#count)
- [fillable](#fillable)
- [selectable](#selectable)
- [hasClass](#hasclass)
- [isHidden](#ishidden)
- [isVisible](#isvisible)
- [is](#is)
- [notHasClass](#nothasclass)
- [property](#property)
- [text](#text)
- [triggerable](#triggerable)
- [value](#value)
- [visitable](#visitable)

## attribute

[addon/-private/properties/attribute.js:70-90](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/attribute.js#L70-L90 "Source code on GitHub")

**Parameters**

-   `attributeName` **string** Name of the attribute to get
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <input placeholder="a value">

const page = PageObject.create({
  inputPlaceholder: PageObject.attribute('placeholder', 'input')
});

assert.equal(page.inputPlaceholder, 'a value');
```

```javascript
// <input placeholder="a value">
// <input placeholder="other value">

const page = PageObject.create({
  inputPlaceholders: PageObject.attribute('placeholder', ':input', { multiple: true })
});

assert.deepEqual(page.inputPlaceholders, ['a value', 'other value']);
```

```javascript
// <div><input></div>
// <div class="scope"><input placeholder="a value"></div>
// <div><input></div>

const page = PageObject.create({
  inputPlaceholder: PageObject.attribute('placeholder', ':input', { scope: '.scope' })
});

assert.equal(page.inputPlaceholder, 'a value');
```

```javascript
// <div><input></div>
// <div class="scope"><input placeholder="a value"></div>
// <div><input></div>

const page = PageObject.create({
  scope: 'scope',
  inputPlaceholder: PageObject.attribute('placeholder', ':input')
});

assert.equal(page.inputPlaceholder, 'a value');
```

Returns **Descriptor** 

## clickOnText

[addon/-private/properties/click-on-text.js:81-100](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/click-on-text.js#L81-L100 "Source code on GitHub")

Clicks on an element containing specified text.

The element can either match a specified selector,
or be inside an element matching the specified selector.

**Parameters**

-   `selector` **string** CSS selector of the element in which to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.visible` **boolean** Make the action to raise an error if the element is not visible
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <fieldset>
//  <button>Lorem</button>
//  <button>Ipsum</button>
// </fieldset>

const page = PageObject.create({
  clickOnFieldset: PageObject.clickOnText('fieldset'),
  clickOnButton: PageObject.clickOnText('button')
});

// queries the DOM with selector 'fieldset :contains("Lorem"):last'
page.clickOnFieldset('Lorem');

// queries the DOM with selector 'button:contains("Ipsum")'
page.clickOnButton('Ipsum');
```

```javascript
// <div class="scope">
//   <fieldset>
//    <button>Lorem</button>
//    <button>Ipsum</button>
//   </fieldset>
// </div>

const page = PageObject.create({
  clickOnFieldset: PageObject.clickOnText('fieldset', { scope: '.scope' }),
  clickOnButton: PageObject.clickOnText('button', { scope: '.scope' })
});

// queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
page.clickOnFieldset('Lorem');

// queries the DOM with selector '.scope button:contains("Ipsum")'
page.clickOnButton('Ipsum');
```

```javascript
// <div class="scope">
//   <fieldset>
//    <button>Lorem</button>
//    <button>Ipsum</button>
//   </fieldset>
// </div>

const page = PageObject.create({
  scope: '.scope',
  clickOnFieldset: PageObject.clickOnText('fieldset'),
  clickOnButton: PageObject.clickOnText('button')
});

// queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
page.clickOnFieldset('Lorem');

// queries the DOM with selector '.scope button:contains("Ipsum")'
page.clickOnButton('Ipsum');
```

Returns **Descriptor** 

## clickable

[addon/-private/properties/clickable.js:59-78](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/clickable.js#L59-L78 "Source code on GitHub")

Clicks elements matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element to click
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.visible` **boolean** Make the action to raise an error if the element is not visible
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <button class="continue">Continue<button>
// <button>Cancel</button>

const page = PageObject.create({
  continue: clickable('button.continue')
});

// clicks on element with selector 'button.continue'
page.continue();
```

```javascript
// <div class="scope">
//   <button>Continue<button>
// </div>
// <button>Cancel</button>

const page = PageObject.create({
  continue: clickable('button.continue', { scope: '.scope' })
});

// clicks on element with selector '.scope button.continue'
page.continue();
```

```javascript
// <div class="scope">
//   <button>Continue<button>
// </div>
// <button>Cancel</button>

const page = PageObject.create({
  scope: '.scope',
  continue: clickable('button.continue')
});

// clicks on element with selector '.scope button.continue'
page.continue();
```

Returns **Descriptor** 

## collection

[addon/-private/properties/collection.js:205-231](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/collection.js#L205-L231 "Source code on GitHub")

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

## contains

[addon/-private/properties/contains.js:84-103](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/contains.js#L84-L103 "Source code on GitHub")

Returns a boolean representing whether an element or a set of elements contains the specified text.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector contain the subtext
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// Lorem <span>ipsum</span>

const page = PageObject.create({
  spanContains: PageObject.contains('span')
});

assert.ok(page.spanContains('ipsum'));
```

```javascript
// <span>lorem</span>
// <span>ipsum</span>
// <span>dolor</span>

const page = PageObject.create({
  spansContain: PageObject.contains('span', { multiple: true })
});

// not all spans contain 'lorem'
assert.notOk(page.spansContain('lorem'));
```

```javascript
// <span>super text</span>
// <span>regular text</span>

const page = PageObject.create({
  spansContain: PageObject.contains('span', { multiple: true })
});

// all spans contain 'text'
assert.ok(page.spanContains('text'));
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  spanContains: PageObject.contains('span', { scope: '.scope' })
});

assert.notOk(page.spanContains('lorem'));
assert.ok(page.spanContains('ipsum'));
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scope: '.scope',

  spanContains: PageObject.contains('span')
});

assert.notOk(page.spanContains('lorem'));
assert.ok(page.spanContains('ipsum'));
```

Returns **Descriptor** 

## count

[addon/-private/properties/count.js:74-89](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/count.js#L74-L89 "Source code on GitHub")

**Parameters**

-   `selector` **string** CSS selector of the element or elements to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Add scope
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <span>1</span>
// <span>2</span>

const page = PageObject.create({
  spanCount: PageObject.count('span')
});

assert.equal(page.spanCount, 2);
```

```javascript
// <div>Text</div>

const page = PageObject.create({
  spanCount: PageObject.count('span')
});

assert.equal(page.spanCount, 0);
```

```javascript
// <div><span></span></div>
// <div class="scope"><span></span><span></span></div>

const page = PageObject.create({
  spanCount: PageObject.count('span', { scope: '.scope' })
});

assert.equal(page.spanCount, 2)
```

```javascript
// <div><span></span></div>
// <div class="scope"><span></span><span></span></div>

const page = PageObject.create({
  scope: '.scope',
  spanCount: PageObject.count('span')
});

assert.equal(page.spanCount, 2)
```

```javascript
// <div><span></span></div>
// <div class="scope"><span></span><span></span></div>

const page = PageObject.create({
  scope: '.scope',
  spanCount: PageObject.count('span', { resetScope: true })
});

assert.equal(page.spanCount, 1);
```

Returns **Descriptor** 

## fillable

[addon/-private/properties/fillable.js:107-147](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/fillable.js#L107-L147 "Source code on GitHub")

Fills in an input matched by a selector.

**Parameters**

-   `selector` **string** CSS selector of the element to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

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

[addon/-private/properties/fillable.js:107-147](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/fillable.js#L107-L147 "Source code on GitHub")

Alias for `fillable`, which works for inputs and HTML select menus.

[See `fillable` for usage examples.](#fillable)

**Parameters**

-   `selector` **string** CSS selector of the element to look for text
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

Returns **Descriptor** 

## hasClass

[addon/-private/properties/has-class.js:85-102](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/has-class.js#L85-L102 "Source code on GitHub")

Validates if an element or a set of elements have a given CSS class.

**Parameters**

-   `cssClass` **string** CSS class to be validated
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector have the CSS class
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <em class="lorem"></em><span class="success">Message!</span>

const page = PageObject.create({
  messageIsSuccess: PageObject.hasClass('success', 'span')
});

assert.ok(page.messageIsSuccess);
```

```javascript
// <span class="success"></span>
// <span class="error"></span>

const page = PageObject.create({
  messagesAreSuccessful: PageObject.hasClass('success', 'span', { multiple: true })
});

assert.notOk(page.messagesAreSuccessful);
```

```javascript
// <span class="success"></span>
// <span class="success"></span>

const page = PageObject.create({
  messagesAreSuccessful: PageObject.hasClass('success', 'span', { multiple: true })
});

assert.ok(page.messagesAreSuccessful);
```

```javascript
// <div>
//   <span class="lorem"></span>
// </div>
// <div class="scope">
//   <span class="ipsum"></span>
// </div>

const page = PageObject.create({
  spanHasClass: PageObject.hasClass('ipsum', 'span', { scope: '.scope' })
});

assert.ok(page.spanHasClass);
```

```javascript
// <div>
//   <span class="lorem"></span>
// </div>
// <div class="scope">
//   <span class="ipsum"></span>
// </div>

const page = PageObject.create({
  scope: '.scope',
  spanHasClass: PageObject.hasClass('ipsum', 'span')
});

assert.ok(page.spanHasClass);
```

Returns **Descriptor** 

## isHidden

[addon/-private/properties/is-hidden.js:90-107](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/is-hidden.js#L90-L107 "Source code on GitHub")

Validates if an element or set of elements are hidden or exist in the DOM.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector are hidden
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// Lorem <span style="display:none">ipsum</span>

const page = PageObject.create({
  spanIsHidden: PageObject.isHidden('span')
});

assert.ok(page.spanIsHidden);
```

```javascript
// <span>ipsum</span>
// <span style="display:none">dolor</span>

const page = create({
  spansAreHidden: PageObject.isHidden('span', { multiple: true })
});

// not all spans are hidden
assert.notOk(page.spansAreHidden);
```

```javascript
// <span style="display:none">dolor</span>
// <span style="display:none">dolor</span>

const page = create({
  spansAreHidden: PageObject.isHidden('span', { multiple: true })
});

// all spans are hidden
assert.ok(page.spansAreHidden);
```

```javascript
// Lorem <strong>ipsum</strong>

const page = PageObject.create({
  spanIsHidden: PageObject.isHidden('span')
});

// returns true when element doesn't exist in DOM
assert.ok(page.spanIsHidden);
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span style="display:none">ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scopedSpanIsHidden: PageObject.isHidden('span', { scope: '.scope' })
});

assert.ok(page.scopedSpanIsHidden);
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span style="display:none">ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scope: '.scope',
  scopedSpanIsHidden: PageObject.isHidden('span')
});

assert.ok(page.scopedSpanIsHidden);
```

Returns **Descriptor** 

## isVisible

[addon/-private/properties/is-visible.js:96-117](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/is-visible.js#L96-L117 "Source code on GitHub")

Validates if an element or set of elements are visible.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector are visible
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// Lorem <span>ipsum</span>

const page = PageObject.create({
  spanIsVisible: PageObject.isVisible('span')
});

assert.ok(page.spanIsVisible);
```

```javascript
// <span>ipsum</span>
// <span style="display:none">dolor</span>

const page = PageObject.create({
  spansAreVisible: PageObject.isVisible('span', { multiple: true })
});

// not all spans are visible
assert.notOk(page.spansAreVisible);
```

```javascript
// <span>ipsum</span>
// <span>dolor</span>

const page = PageObject.create({
  spansAreVisible: PageObject.isVisible('span', { multiple: true })
});

// all spans are visible
assert.ok(page.spansAreVisible);
```

```javascript
// Lorem <strong>ipsum</strong>

const page = PageObject.create({
  spanIsVisible: PageObject.isHidden('span')
});

// returns false when element doesn't exist in DOM
assert.notOk(page.spanIsVisible);
```

```javascript
// <div>
//   <span style="display:none">lorem</span>
// </div>
// <div class="scope">
//   <span>ipsum</span>
// </div>

const page = PageObject.create({
  spanIsVisible: PageObject.isHidden('span', { scope: '.scope' })
});

assert.ok(page.spanIsVisible);
```

```javascript
// <div>
//   <span style="display:none">lorem</span>
// </div>
// <div class="scope">
//   <span>ipsum</span>
// </div>

const page = PageObject.create({
  scope: '.scope',
  spanIsVisible: PageObject.isHidden('span')
});

assert.ok(page.spanIsVisible);
```

Returns **Descriptor** 

## is

[addon/-private/properties/is.js:45-62](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/is.js#L45-L62 "Source code on GitHub")

**Parameters**

-   `testSelector` **string** CSS selector to test
-   `targetSelector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <input type="checkbox" checked="checked">
// <input type="checkbox" checked>

const page = PageObject.create({
  areInputsChecked: is(':checked', 'input', { multiple: true })
});

assert.equal(page.areInputsChecked, true, 'Inputs are checked');
```

```javascript
// <button class="toggle-button active" disabled>Toggle something</button>

const page = PageObject.create({
  isToggleButtonActive: is('.active:disabled', '.toggle-button')
});

assert.equal(page.isToggleButtonActive, true, 'Button is active');
```

Returns **Descriptor** 

## notHasClass

[addon/-private/properties/not-has-class.js:89-106](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/not-has-class.js#L89-L106 "Source code on GitHub")

**Parameters**

-   `cssClass` **string** CSS class to be validated
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector don't have the CSS class
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <em class="lorem"></em><span class="success">Message!</span>

const page = PageObject.create({
  messageIsSuccess: PageObject.notHasClass('error', 'span')
});

assert.ok(page.messageIsSuccess);
```

```javascript
// <span class="success"></span>
// <span class="error"></span>

const page = PageObject.create({
  messagesAreSuccessful: PageObject.notHasClass('error', 'span', { multiple: true })
});

// one span has error class
assert.notOk(page.messagesAreSuccessful);
```

```javascript
// <span class="success"></span>
// <span class="success"></span>

const page = PageObject.create({
  messagesAreSuccessful: PageObject.notHasClass('error', 'span', { multiple: true })
});

// no spans have error class
assert.ok(page.messagesAreSuccessful);
```

```javascript
// <div>
//   <span class="lorem"></span>
// </div>
// <div class="scope">
//   <span class="ipsum"></span>
// </div>

const page = PageObject.create({
  spanNotHasClass: PageObject.notHasClass('lorem', 'span', { scope: '.scope' })
});

assert.ok(page.spanNotHasClass);
```

```javascript
// <div>
//   <span class="lorem"></span>
// </div>
// <div class="scope">
//   <span class="ipsum"></span>
// </div>

const page = PageObject.create({
  scope: '.scope',
  spanNotHasClass: PageObject.notHasClass('lorem', 'span')
});

assert.ok(page.spanNotHasClass);
```

Returns **Descriptor** 

## property

[addon/-private/properties/property.js:56-76](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/property.js#L56-L76 "Source code on GitHub")

**Parameters**

-   `propertyName` **string** Name of the property to get
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <input type="checkbox" checked="checked">

const page = PageObject.create({
  isChecked: PageObject.property('checked', 'input')
});

assert.ok(page.isChecked);
```

```javascript
// <input type="checkbox" checked="checked">
// <input type="checkbox" checked="">

const page = PageObject.create({
  inputsChecked: PageObject.property('checked', 'input', { multiple: true })
});

assert.deepEqual(page.inputsChecked, [true, false]);
```

```javascript
// <div><input></div>
// <div class="scope"><input type="checkbox" checked="checked"></div>
// <div><input></div>

const page = PageObject.create({
  isChecked: PageObject.property('checked', 'input', { scope: '.scope' })
});

assert.ok(page.isChecked);
```

Returns **Descriptor** 

## text

[addon/-private/properties/text.js:92-112](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/text.js#L92-L112 "Source code on GitHub")

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Return an array of values
    -   `options.normalize` **boolean** Set to `false` to avoid text normalization
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// Hello <span>world!</span>

const page = PageObject.create({
  text: PageObject.text('span')
});

assert.equal(page.text, 'world!');
```

```javascript
// <span>lorem</span>
// <span> ipsum </span>
// <span>dolor</span>

const page = PageObject.create({
  texts: PageObject.text('span', { multiple: true })
});

assert.deepEqual(page.texts, ['lorem', 'ipsum', 'dolor']);
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  text: PageObject.text('span', { scope: '.scope' })
});

assert.equal(page.text, 'ipsum');
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scope: '.scope',
  text: PageObject.text('span')
});

// returns 'ipsum'
assert.equal(page.text, 'ipsum');
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope">
//  ipsum
// </div>
// <div><span>dolor</span></div>

const page = PageObject.create({
  scope: '.scope',
  text: PageObject.text('span', { normalize: false })
});

// returns 'ipsum'
assert.equal(page.text, '\n ipsum\n');
```

Returns **Descriptor** 

## triggerable

[addon/-private/properties/triggerable.js:73-92](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/triggerable.js#L73-L92 "Source code on GitHub")

Triggers event on element matched by selector.

**Parameters**

-   `event` **string** Event to be triggered
-   `selector` **string** CSS selector of the element on which the event will be triggered
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Ignore parent scope
    -   `options.testContainer` **String** Context where to search elements in the DOM
    -   `options.eventProperties` **String** Event properties that will be passed to trigger function
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <input class="name">
// <input class="email">

const page = PageObject.create({
  focus: triggerable('focus', '.name')
});

// focuses on element with selector '.name'
page.focus();
```

```javascript
// <input class="name">
// <input class="email">

const page = PageObject.create({
  enter: triggerable('keypress', '.name', { eventProperties: { keyCode: 13 } })
});

// triggers keypress using enter key on element with selector '.name'
page.enter();
```

```javascript
// <div class="scope">
//   <input class="name">
// </div>
// <input class="email">

const page = PageObject.create({
  focus: triggerable('focus', '.name', { scope: '.scope' })
});

// focuses on element with selector '.scope .name'
page.focus();
```

```javascript
// <div class="scope">
//   <input class="name">
// </div>
// <input class="email">

const page = PageObject.create({
  scope: '.scope',
  focus: triggerable('focus', '.name')
});

// clicks on element with selector '.scope button.continue'
page.focus();
```

Returns **Descriptor** 

## value

[addon/-private/properties/value.js:67-87](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/value.js#L67-L87 "Source code on GitHub")

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.multiple` **boolean** If set, the function will return an array of values
    -   `options.testContainer` **String** Context where to search elements in the DOM
-   `userOptions`   (optional, default `{}`)

**Examples**

```javascript
// <input value="Lorem ipsum">

const page = PageObject.create({
  value: PageObject.value('input')
});

assert.equal(page.value, 'Lorem ipsum');
```

```javascript
// <input value="lorem">
// <input value="ipsum">

const page = PageObject.create({
  value: PageObject.value('input', { multiple: true })
});

assert.deepEqual(page.value, ['lorem', 'ipsum']);
```

```javascript
// <div><input value="lorem"></div>
// <div class="scope"><input value="ipsum"></div>

const page = PageObject.create({
  value: PageObject.value('input', { scope: '.scope' })
});

assert.equal(page.value, 'ipsum');
```

```javascript
// <div><input value="lorem"></div>
// <div class="scope"><input value="ipsum"></div>

const page = PageObject.create({
  scope: '.scope',
  value: PageObject.value('input')
});

assert.equal(page.value, 'ipsum');
```

Returns **Descriptor** 

## visitable

[addon/-private/properties/visitable.js:85-104](https://github.com/san650/ember-cli-page-object/blob/c521335ffba9955a6acaf1006ed503cbb61ba72d/addon/-private/properties/visitable.js#L85-L104 "Source code on GitHub")

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