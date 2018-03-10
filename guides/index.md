---
layout: page
title: Overview
---

The ember-cli-page-object addon makes it easy to create page objects for your acceptance and integration tests.

The addon is:

- Mostly declarative
- Quick to set up and uses convention over configuration
- Extremely easy to extend
- Unobtrusive
- Agnostic to the testing framework (but really hooked on Ember!)

```javascript
import {
  create,
  visitable,
  fillable,
  clickable,
  text
} from 'ember-cli-page-object';

const page = create({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors')
});

test('my awesome test', function(assert) {
  page
    .visit()
    .username('admin')
    .password('invalid')
    .submit();

  andThen(() => {
    assert.equal(page.error, 'Invalid credentials');
  });
});
```

## So, What Is a Page Object?

Ember, and more specifically `ember-testing`, provides a DSL that simplifies the creation and validation of conditions on our tests.

One of the problems with acceptance and integration testing is that many of the CSS selectors used to look up elements are repeated across tests. In some cases, this repetition seems like a smell.

In some cases the complexity of selectors makes it hard to remember what we were actually trying to test. This confusion can lead to difficulties updating tests and collaborating with others.

A widely used design pattern comes to the rescue: page objects. The main idea behind this pattern is to encapsulate in an object the page or component structure being tested, hiding the details of its HTML structure and exposing only the semantic structure of the page.

This addon allows you to define page objects in a declarative fashion, making it simple to model complex pages and components.

### Resources

- [Using the page object pattern with ember-cli](https://wyeworks.com/blog/2015/5/13/using-the-page-object-pattern-with-ember-cli/)
- [Martin Fowler's original description](http://martinfowler.com/bliki/PageObject.html)
- [Selenium's wiki page](https://github.com/SeleniumHQ/selenium/wiki/PageObjects)
