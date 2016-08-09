---
layout: api
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
  assert.ok(page.modal().contains('Are you sure you want to exit the page?'));
});

page.modal().clickOn("I'm sure");
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
      firstName: text('td:nth-of-type(1)'),
      lastName: text('td:nth-of-type(2)')
    },

    caption: text('#users caption')
  })
});

test('show all users', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(login.users().caption(), 'The list of users');
    assert.equal(login.users().count(), 2); // count attribute is added for free
    assert.equal(login.users(1).firstName(), 'Jane');
    assert.equal(login.users(1).lastName(), 'Doe');
    assert.equal(login.users(2).firstName(), 'John');
    assert.equal(login.users(2).lastName(), 'Doe');
  });
});
{% endhighlight %}

<div class="alert alert-warning" role="alert">
  <strong>Note</strong> that ember-cli-page-object collections are 1-based arrays
</div>

## .customHelper

Define reusable helpers using information of the surrounding context.

{% highlight js %}
PageObject.customHelper(function(selector, options) {
  // user code goes here

  return value;
});
{% endhighlight %}

There are three different types of custom helpers and are differentiated by the return value. You can define custom helpers that return:

1. [A _basic type_ value](#basic-type-value)
2. [A _plain object_ value](#plain-object)
3. [A _function_ value](#functions)

Given this HTML snippet, the following is an example of each type of custom helpers

{% highlight html %}
<form>
  <label class="has-error">
    User name
    <input id="userName" />
  </label>
</form>
{% endhighlight %}

### 1. Basic type value

This type of custom helper is useful to return the result of a calculation, for example the result of a jQuery expression.

{% highlight js %}
var disabled = customHelper(function(selector, options) {
  return $(selector).prop('disabled');
});

var page = PageObject.create({
  userName: {
    disabled: disabled('#userName')
  }
});

assert.ok(!page.userName().disabled(), 'user name input is not disabled');
{% endhighlight %}

As you can see the jQuery expression is returned.

### 2. Plain Object

This is very similar to a `component`. The difference with components is that we can do calculations or use custom options before returning the component.

{% highlight js %}
var input = customHelper(function(selector, options) {
  return {
    value: value(selector),
    hasError: function() {
      return $(selector).parent().hasClass('has-error');
    }
  };
});

var page = PageObject.create({
  scope: 'form',
  userName: input('#userName')
});

assert.ok(page.userName().hasError(), 'user name has errors');
{% endhighlight %}

As you can see the returned plain object is converted to a component.

### 3. Functions

The main difference with the previous custom helpers is that the returned functions receive invocation parameters. This is most useful when creating custom actions that receives options when invoked (like `fillIn` helper).

{% highlight js %}
/* global click */
var clickManyTimes = customHelper(function(selector, options) {
  return function(numberOfTimes) {
    click(selector);

    for(let i = 0; i < numberOfTimes - 1; i++) {
      click(selector);
    }
  };
});

var page = PageObject.create({
  clickAgeSelector: clickManyTimes('#ageSelector .spinner-button'),
  ageValue: value('#ageSelector input')
});

page.visit().clickOnAgeSelector(18 /* times*/);

andThen(function() {
  assert.equal(page.ageValue(), 18, 'User is 18 years old');
});
{% endhighlight %}

We can see that our `clickOnAgeSelector` takes one parameter that's used by the returned function.

### Custom options

Custom helpers can receive custom options, here's an example of this:

{% highlight js %}
var prop = customHelper(function(selector, options) {
  return $(selector).prop(options.name);
});

var page = PageObject.create({
  userName: {
    disabled: prop('#userName', { name: 'disabled' })
  }
});

assert.ok(!page.userName().disabled(), 'user name input is not disabled');
{% endhighlight %}

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
  assert.equal(page.textBody(), 'Lorem ipsum dolor.');
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
  assert.ok(page.input().hasError(), 'Input has an error');
});
{% endhighlight %}

### `collection` inherits parent scope by default

{% highlight html %}
<div class="todo">
  <input type="text" value="invalid value" class="error" placeholder="To do..." />
  <input type="text" placeholder="To do..." />
  <input type="text" placeholder="To do..." />
  <input type="text" placeholder="To do..." />

  <button>Create</button>
</div>
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  scope: '.todo',

  todos: collection({
    itemScope: 'input',

    item: {
      value: value(),
      hasError: hasClass('error')
    },

    create: clickable('button')
  });
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
        <code>page.todos().create()</code>
      </td>
      <td>
        <code>click('.todo button')</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>page.todos(1).value()</code>
      </td>
      <td>
        <code>find('.todo input:eq(0)').val()</code>
      </td>
    </tr>
  </tbody>
</table>

You can reset parent scope by setting the `scope` attribute on the collection declaration.

{% highlight js %}
var page = PageObject.create({
  scope: '.todo',

  todos: collection({
    scope: ' ',
    itemScope: 'input',

    item: {
      value: value(),
      hasError: hasClass('error')
    },

    create: clickable('button')
  });
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
        <code>page.todos().create()</code>
      </td>
      <td>
        <code>click('button')</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>page.todos(1).value()</code>
      </td>
      <td>
        <code>find('input:eq(0)').val()</code>
      </td>
    </tr>
  </tbody>
</table>

`itemScope` is inherited as default scope on components defined inside the item object.

{% highlight html %}
<ul class="todos">
  <li>
    <span>To do</span>
    <input value="" />
  </li>
  ...
</ul>
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  scope: '.todos',

  todos: collection({
    itemScope: 'li',

    item: {
      label: text('span'),
      input: {
        value: value('input')
      }
    }
  });
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
        <code>page.todos(1).input().value()</code>
      </td>
      <td>
        <code>find('.todos li:nth-of-child(1) input').val()</code>
      </td>
    </tr>
  </tbody>
</table>

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
        <code>page.search().input().value()</code>
      </td>
      <td>
        <code>find('.search input').val()</code>
      </td>
    </tr>
  </tbody>
</table>

You can reset parent scope by setting the `scope` attribute on the component declaration.

{% highlight js %}
var page = PageObject.create({
  search: {
    scope: '.search',

    input: {
      scope: 'input',

      fillIn: fillable(),
      value: value()
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
        <code>page.search().input().value()</code>
      </td>
      <td>
        <code>find('input').val()</code>
      </td>
    </tr>
  </tbody>
</table>
