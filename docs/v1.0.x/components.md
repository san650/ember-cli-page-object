---
layout: page
title: Components
---

Group attributes and create new ones

* [Components](#components)
* [Default attributes](#default-attributes)
* [.collection](#collection)
* [.customHelper](#customhelper)
* [Scopes](#scopes)

## Components

Components let you group attributes together, they are just plain objects with attributes on it. Components can define a scope.

__Example__

{% highlight html %}
<h1>New user</h1>
<form class="awesome-form">
  <input id="firstName" placeholder="First name">
  <input id="lastName" placeholder="Last name">
  <button>Create</button>
</form>
{% endhighlight %}

{% highlight js %}
const { visitable, text, fillable, clickable } = PageObject;

var page = PageObject.create({
  visit: visitable('/user/create'),
  title: text('h1'),

  form: {
    scope: '.awesome-form',

    firstName: fillable('#firstName'),
    lastName: fillable('#lastName'),
    submit: clickable('button')
  }
});

page
  .visit()
  .form()
  .firstName('John')
  .lastName('Doe')
  .submit();

andThen(function() {
  // assert something
});
{% endhighlight %}

## Default attributes

By default, all components define handy attributes to be used without been explicitely declared.

* [isVisible](/api/predicates/#isvisible)
* [isHidden](/api/predicates/#ishidden)
* [clickOn](/api/actions/#clickontext)
* [click](/api/actions/#clickable)
* [contains](/api/predicates/#contains)
* [text](/api/queries/#text)

<div class="alert alert-warning" role="alert">
  <strong>Note</strong> that these attributes will use the component scope as their selector.
</div>

__Example__

Suppose you have a modal dialog

{% highlight html %}
<div class="modal">
  Are you sure you want to exit the page?
  <button>I'm sure</button>
  <button>No</button>
</form>
{% endhighlight %}

{% highlight js %}
const { visitable } = PageObject;

var page = PageObject.create({
  visit: visitable('/'),

  modal: {
    scope: '.modal'
  }
});

page.visit();

andThen(function() {
  assert.ok(page.modal.contains('Are you sure you want to exit the page?'));
});

page.modal.clickOn("I'm sure");
{% endhighlight %}

## .collection

Easily model a table or a list of items.

__Attribute signature__

{% highlight js %}
PageObject.collection(definition)
{% endhighlight %}

The collection definition has the following structure

{% highlight js %}
{
  itemScope: '', // css selector

  item: {
    // item attributes
  },

  // collection attributes
}
{% endhighlight %}

The attributes defined in the `item` object are scoped using the `itemScope` selector. The attributes defined outside the `item` object are available at collection scope.

__Example__

{% highlight html %}
<table id="users">
  <caption>The list of users</caption>
  <tr>
    <td>Jane</td>
    <td>Doe</td>
  </tr>
  <tr>
    <td>John</td>
    <td>Doe</td>
  </tr>
</table>
{% endhighlight %}

{% highlight js %}
const { visitable, text, collection } = PageObject;

var page = PageObject.create({
  visit: visitable('/users'),

  users: collection({
    itemScope: '#users tr',

    item: {
      firstName: text('td', { at: 0 }),
      lastName: text('td', { at: 1})
    },

    caption: text('#users caption')
  })
});

test('show all users', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(login.users.caption, 'The list of users');
    assert.equal(login.users.count(), 2); // count attribute is added for free
    assert.equal(login.users(0).firstName, 'Jane');
    assert.equal(login.users(0).lastName, 'Doe');
    assert.equal(login.users(1).firstName, 'John');
    assert.equal(login.users(1).lastName, 'Doe');
  });
});
{% endhighlight %}

<div class="alert alert-warning" role="alert">
  <strong>Note</strong> that ember-cli-page-object collections are now 0-based arrays!
</div>

## .customHelper

Custom helpers are no longer supported, but you can migrate away from
them by creating `Ceibo` descriptors (wonder what `Ceibo` is? you can
check it over [here](http://github.com/san650/ceibo)).

Example `v0.x`:

{% highlight js %}
var disabled = customHelper(function(selector, options) {
  return $(selector).prop('disabled');
});
{% endhighlight %}

On version `1.x` this can be represented as:

{% highlight js %}
import { findElement } from './page-object/helpers';

function disabled(selector, options = {}) {
  return {
    isDescriptor: true,
    get() {
      return findElement(this, selector, options).prop('disabled');
    }
  }
}

export default disabled;
{% endhighlight %}

Example of usage:

{% highlight js %}
let page = PageObject.create({
  scope: '.page',

  isAdmin: disabled('#override-name')
});
{% endhighlight %}

`page.isAdmin` will look for elements in the DOM that match ".page
\#override-name" and check if they are disabled.

## Scopes

The `scope` attribute can be used to reduce the set of matched elements to the ones enclosed by the given selector.

Given the following HTML

{% highlight html %}
<div class="article">
  <p>Lorem ipsum dolor</p>
</div>
<div class="footer">
  <p>Copyright 2015 - Acme Inc.</p>
</div>
{% endhighlight %}

the following configuration will match the article paragraph element

{% highlight js %}
var page = PageObject.create({
  scope: '.article',

  textBody: PageObject.text('p'),
});

andThen(function() {
  assert.equal(page.textBody, 'Lorem ipsum dolor.');
});
{% endhighlight %}

The attribute's selector can be omited when the scope matches the element we want to use.

Given the following HTML

{% highlight html %}
<form>
  <input id="userName" value="a value" />
  <button>Submit</button>
</form>
{% endhighlight %}

We can define several attributes on the same `input` element as follows

{% highlight js %}
var page = PageObject.create({
  input: {
    scope: '#userName',

    hasError: hasClass('has-error'),
    value: value(),
    fillIn: fillable()
  },

  submit: clickable('button')
});

page
  .input()
  .fillIn('an invalid value');

page.submit();

andThen(function() {
  assert.ok(page.input.hasError, 'Input has an error');
});
{% endhighlight %}

### `component` inherits parent scope by default

{% highlight html %}
<div class="search">
  <input placeholder="Search..." />
  <button>Search</button>
</div>
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  search: {
    scope: '.search',

    input: {
      fillIn: fillable('input'),
      value: value('input')
    }
  }
});
{% endhighlight %}

<table class="table">
  <thead>
    <tr>
      <th>
        call
      </th>
      <th>
        translates to
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>page.search.input.value</code>
      </td>
      <td>
        <code>find('.search input').val()</code>
      </td>
    </tr>
  </tbody>
</table>

You can reset parent scope by setting the `scope` and `resetScope` attribute on the component declaration.

{% highlight js %}
var page = PageObject.create({
  search: {
    scope: '.search',

    input: {
      scope: 'input',
      resetScope: true,

      fillIn: fillable()
    }
  }
});
{% endhighlight %}

<table class="table">
  <thead>
    <tr>
      <th>
        call
      </th>
      <th>
        translates to
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>page.search.input.value</code>
      </td>
      <td>
        <code>find('input').val()</code>
      </td>
    </tr>
  </tbody>
</table>
