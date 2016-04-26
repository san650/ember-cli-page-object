---
layout: page
title: Predicates
---

{% raw %}
### Methods

- [contains](#contains)
- [hasClass](#hasclass)
- [isHidden](#ishidden)
- [isVisible](#isvisible)
- [notHasClass](#nothasclass)

## contains

[addon/predicates/contains.js:83-97](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/predicates/contains.js#L83-L97 "Source code on GitHub")

Returns a boolean representing whether an element or a set of elements contains the specified text.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector contain the subtext
    -   `options.testContainer` **String** Context where to search elements in the DOM

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

## hasClass

[addon/predicates/has-class.js:84-96](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/predicates/has-class.js#L84-L96 "Source code on GitHub")

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

[addon/predicates/is-hidden.js:89-101](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/predicates/is-hidden.js#L89-L101 "Source code on GitHub")

Validates if an element or set of elements are hidden.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector are hidden
    -   `options.testContainer` **String** Context where to search elements in the DOM

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

[addon/predicates/is-visible.js:95-111](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/predicates/is-visible.js#L95-L111 "Source code on GitHub")

Validates if an element or set of elements are visible.

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector are visible
    -   `options.testContainer` **String** Context where to search elements in the DOM

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

## notHasClass

[addon/predicates/not-has-class.js:86-98](https://github.com/san650/ember-cli-page-object/blob/81c06fc3fedec62532d3b8d8155a785d76c3ce7b/addon/predicates/not-has-class.js#L86-L98 "Source code on GitHub")

Validates if an element or a set of elements don't have a given CSS class.

**Parameters**

-   `cssClass` **string** CSS class to be validated
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope within parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector don't have the CSS class
    -   `options.testContainer` **String** Context where to search elements in the DOM

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
{% endraw %}