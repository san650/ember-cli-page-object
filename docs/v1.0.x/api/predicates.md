---
layout: page
title: Predicates
---

- [contains](#contains)
- [hasClass](#hasclass)
- [isHidden](#ishidden)
- [isVisible](#isvisible)
- [notHasClass](#nothasclass)

## contains

[test-support/page-object/predicates/contains.js:82-94](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/predicates/contains.js#L82-L94 "Source code on GitHub")

Validates if an element or a set of elements contain a subtext

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector contain the subtext

**Examples**

```javascript
// Lorem <span>ipsum</span>

let page = PageObject.create({
 spanContains: PageObject.contains('span')
});

assert.ok(page.spanContains('ipsum'));
```

```javascript
// <span>lorem</span>
// <span>ipsum</span>
// <span>dolor</span>

let page = PageObject.create({
  spansContain: PageObject.contains('span', { multiple: true })
});

// not all spans contain 'lorem'
assert.ok(!page.spansContain('lorem'));
```

```javascript
// <span>super text</span>
// <span>regular text</span>

let page = PageObject.create({
  spansContain: PageObject.contains('span', { multiple: true })
});

// all spans contain 'text'
assert.ok(page.spanContains('text'));
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

let page = PageObject.create({
  spanContains: PageObject.contains('span', { scope: '.scope' })
});

assert.ok(!page.spanContains('lorem'));
assert.ok(page.foo('ipsum'));
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span>ipsum</span></div>
// <div><span>dolor</span></div>

let page = PageObject.create({
  scope: '.scope',

  spanContains: PageObject.contains('span')
});

assert.ok(!page.spanContains('lorem'));
assert.ok(page.foo('ipsum'));
```

Returns **Descriptor** 

## hasClass

[test-support/page-object/predicates/has-class.js:83-95](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/predicates/has-class.js#L83-L95 "Source code on GitHub")

Validates if an element or a set of elements have a given CSS class

**Parameters**

-   `cssClass` **string** CSS class to be validated
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector have the CSS class

**Examples**

```javascript
// <em class="lorem"></em><span class="success">Message!</span>

let page = PageObject.create({
  messageIsSuccess: PageObject.hasClass('success', 'span')
});

assert.ok(page.messageIsSuccess);
```

```javascript
// <span class="success"></span>
// <span class="error"></span>

let page = PageObject.create({
  messagesAreSuccessful: PageObject.hasClass('success', 'span', { multiple: true })
});

assert.ok(!page.messagesAreSuccessful);
```

```javascript
// <span class="success"></span>
// <span class="success"></span>

let page = PageObject.create({
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

let page = PageObject.create({
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

let page = PageObject.create({
  scope: '.scope',
  spanHasClass: PageObject.hasClass('ipsum', 'span')
});

assert.ok(page.spanHasClass);
```

Returns **Descriptor** 

## isHidden

[test-support/page-object/predicates/is-hidden.js:88-100](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/predicates/is-hidden.js#L88-L100 "Source code on GitHub")

Validates if an element or set of elements are hidden

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector are hidden

**Examples**

```javascript
// Lorem <span style="display:none">ipsum</span>

let page = PageObject.create({
  spanIsHidden: PageObject.isHidden('span')
});

assert.ok(page.spanIsHidden);
```

```javascript
// <span>ipsum</span>
// <span style="display:none">dolor</span>

let page = create({
  spansAreHidden: PageObject.isHidden('span', { multiple: true })
});

// not all spans are hidden
assert.ok(!page.spansAreHidden);
```

```javascript
// <span style="display:none">dolor</span>
// <span style="display:none">dolor</span>

let page = create({
  spansAreHidden: PageObject.isHidden('span', { multiple: true })
});

// all spans are hidden
assert.ok(page.spansAreHidden);
```

```javascript
// Lorem <div>ipsum</div>

let page = PageObject.create({
  spanIsHidden: PageObject.isHidden('span')
});

// returns true when element doesn't exist in DOM
assert.ok(page.spanIsHidden);
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span style="display:none">ipsum</span></div>
// <div><span>dolor</span></div>

let page = PageObject.create({
  scopedSpanIsHidden: PageObject.isHidden('span', { scope: '.scope' })
});

assert.ok(page.scopedSpanIsHidden);
```

```javascript
// <div><span>lorem</span></div>
// <div class="scope"><span style="display:none">ipsum</span></div>
// <div><span>dolor</span></div>

let page = PageObject.create({
  scope: '.scope',
  scopedSpanIsHidden: PageObject.isHidden('span')
});

assert.ok(page.scopedSpanIsHidden);
```

Returns **Descriptor** 

## isVisible

[test-support/page-object/predicates/is-visible.js:87-103](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/predicates/is-visible.js#L87-L103 "Source code on GitHub")

Validates if an element or set of elements are visible

**Parameters**

-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector are visible

**Examples**

```javascript
// Lorem <span>ipsum</span>

let page = PageObject.create({
  spanIsVisible: PageObject.isVisible('span')
});

assert.ok(page.spanIsVisible);
```

```javascript
// <span>ipsum</span>
// <span style="display:none">dolor</span>

let page = PageObject.create({
  spansAreVisible: PageObject.isVisible('span', { multiple: true })
});

// not all spans are visible
assert.ok(!page.spansAreVisible);
```

```javascript
// <span>ipsum</span>
// <span>dolor</span>

let page = PageObject.create({
  spansAreVisible: PageObject.isVisible('span', { multiple: true })
});

// all spans are visible
assert.ok(page.spansAreVisible);
```

```javascript
// Lorem <div>ipsum</div>

let page = PageObject.create({
  spanIsVisible: PageObject.isHidden('span')
});

// returns false when element doesn't exist in DOM
assert.ok(!page.spanIsVisible);
```

```javascript
// <div><span style="display:none">lorem</span></div>

<div class="scope"><span>ipsum</span></div>

let page = PageObject.create({
  spanIsVisible: PageObject.isHidden('span', { scope: '.scope' })
});

assert.ok(page.spanIsVisible);
```

```javascript
// <div><span style="display:none">lorem</span></div>
// <div class="scope"><span>ipsum</span></div>

let page = PageObject.create({
  scope: '.scope',
  spanIsVisible: PageObject.isHidden('span')
});

assert.ok(page.spanIsVisible);
```

Returns **Descriptor** 

## notHasClass

[test-support/page-object/predicates/not-has-class.js:85-97](https://github.com/jeradg/ember-cli-page-object/blob/7718fb7017aeedb848674a8b26202f2569e32c98/test-support/page-object/predicates/not-has-class.js#L85-L97 "Source code on GitHub")

Validates if an element or a set of elements don't have a given CSS class

**Parameters**

-   `cssClass` **string** CSS class to be validated
-   `selector` **string** CSS selector of the element to check
-   `options` **Object** Additional options
    -   `options.scope` **string** Nests provided scope with parent's scope
    -   `options.at` **number** Reduce the set of matched elements to the one at the specified index
    -   `options.resetScope` **boolean** Override parent's scope
    -   `options.multiple` **boolean** Check if all elements matched by selector don't have the CSS class

**Examples**

```javascript
// <em class="lorem"></em><span class="success">Message!</span>

let page = PageObject.create({
  messageIsSuccess: PageObject.nothasClass('error', 'span')
});

assert.ok(page.messageIsSuccess);
```

```javascript
// <span class="success"></span>
// <span class="error"></span>

let page = PageObject.create({
  messagesAreSuccessful: PageObject.notHasClass('error', 'span', { multiple: true })
});

// one span has error class
assert.ok(!page.messagesAreSuccessful);
```

```javascript
// <span class="success"></span>
// <span class="success"></span>

let page = PageObject.create({
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

let page = PageObject.create({
  spanHasNotClass: PageObject.notHasClass('lorem', 'span', { scope: '.scope' })
});

assert.ok(page.spanHasNotClass);
```

```javascript
// <div>
//   <span class="lorem"></span>
// </div>
// <div class="scope">
//   <span class="ipsum"></span>
// </div>

let page = PageObject.create({
  scope: '.scope',
  spanHasNotClass: PageObject.notHasClass('lorem', 'span')
});

assert.ok(page.spanHasNotClass);
```

Returns **Descriptor** 
