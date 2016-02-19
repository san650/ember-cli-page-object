---
layout: page
title: Overview
---

<div class="row" class="overview">
  <div class="col-sm-5">
    <p>
      This addon makes creating Page Objects for your acceptance test really easy.
    </p>
    <p>
      It's main characteristics are
    </p>

    <ul>
      <li>Mostly declarative</li>
      <li>Proposes a convention</li>
      <li>Extremely easy to extend</li>
      <li>Unobtrusive</li>
      <li>Agnostic to the testing framework (but really hooked on Ember!)</li>
     </ul>
  </div>
  <div class="col-sm-7" class="overview-code">
{% highlight javascript %}

var page = PageObject.create({
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

{% endhighlight %}
  </div>
</div>

## So, What is a Page Object?

Ember, and more specifically `ember-testing` provides a DSL that simplifies creation and validation of conditions on our tests.

One of the problems with acceptance tests is that many of the CSS selectors used to look up elements are repeated across tests. In some cases, this repetition seems like a smell.

In some cases the complexity of selectors use prevents us to easily identify what we were trying to test. This can become very confusing, concealing the original purpose for the test.

A widely-used design pattern comes to the rescue: Page Objects. The main idea behind this pattern is to encapsulate the page structure being tested with an object, hiding the details of its HTML structure and therefore exposing the semantic structure of the page only.

This addon allows you to define page objects in a declarative fashion making really simple to model complex pages.

### Resources

- [Using the page object pattern with ember-cli](https://wyeworks.com/blog/2015/5/13/using-the-page-object-pattern-with-ember-cli/)
- [Martin Fowler's original description](http://martinfowler.com/bliki/PageObject.html)
- [Selenium's wiki page](https://code.google.com/p/selenium/wiki/PageObjects)
