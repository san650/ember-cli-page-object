---
layout: page
title: Actions
---

Encapsulates and extend `ember-testing` async helpers, supporting chaining and
other features.

* [Chaining support](#chaining-support)
* [.clickable](#clickable)
* [.clickOnText](#clickontext)
* [.fillable](#fillable)
* [.selectable](#selectable)
* [.visitable](#visitable)

## Chaining support

Actions can be chained.

__Example__

{% highlight html %}
<input id="name">
<button id="submit">Send</button>
{% endhighlight %}

{% highlight js %}
const { clickable, fillable, visitable } = PageObject;

var page = PageObject.create({
  visit: visitable('/user/new'),
  submit: clickable('#submit'),
  name: fillable('#name')
});

page
  .visit()
  .name('John Doe')
  .submit();

andThen(function() {
  // form was submitted
});
{% endhighlight %}

## .clickable

Creates an action to click an element.

__Attribute signature__

{% highlight js %}
PageObject.clickable(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<button id="submit">Send</button>
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  submitForm: PageObject.clickable('#submit')
});

page.submitForm();

andThen(function() {
  // form was submitted
});
{% endhighlight %}

## .clickOnText

Creates an action to click on an element by text. The text is case sensitive.

__Attribute signature__

{% highlight js %}
PageObject.clickOnText(selector, [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<button class="btn">Create</button>
<button class="btn">Cancel</button>
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  click: clickOnText('.btn')
});

page.click("Create");

andThen(function() {
  // ...
});

page.click("Cancel");

andThen(function() {
  // ...
});
{% endhighlight %}

> A string of text to look for. It's case sensitive.
> The text must have matching case to be selected.
> gwill match elements with the desired text block:

## .fillable

Fills an input.

__Attribute signature__

{% highlight js %}
PageObject.fillable(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<input id="name">
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  name: PageObject.fillable('#name')
});

page.name('John Doe');

andThen(function() {
  // the input value is set
});
{% endhighlight %}

## .selectable

Selects an option.

__Attribute signature__

{% highlight js %}
PageObject.selectable(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<select id="gender">
  <option>Male</options>
  <option>Female</options>
</select>
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  selectGender: PageObject.selectable('#gender')
});

page.selectGender('Female');

andThen(function() {
  // the option is selected
});
{% endhighlight %}

## .visitable

Visits a page.

__Attribute signature__

{% highlight js %}
PageObject.visitable(routePath)
{% endhighlight %}

__Example__

{% highlight js %}
var page = PageObject.create({
  visit: PageObject.visitable('/users')
});

page.visit();

andThen(function() {
  // the page is loaded
});
{% endhighlight %}

You can define dynamic segments in the path as follows

{% highlight js %}
var page = PageObject.create({
  visit: PageObject.visitable('/users/:user_id/comments/:comment_id')
});

page.visit({ user_id: 5, comment_id: 1 });

andThen(function() {
  assert.equal(currentURL(), '/users/5/comments/1');
});
{% endhighlight %}

You can also use query params when invoking the action as follows

{% highlight js %}
var page = PageObject.create({
  visit: PageObject.visitable('/users')
});

page.visit({}, { display: "collapsed" });

andThen(function() {
  assert.equal(currentURL(), '/users?display=collapsed');
});
{% endhighlight %}
