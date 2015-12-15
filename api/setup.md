---
layout: page
title: Setup
permalink: /api/setup/
---

- [Importing the PageObject object](#importing-the-pageobject-object)
- [The .create method](#the-create-method)

## Importing the PageObject object

You can import the PageObject object using the `import` construct as follows:

{% highlight js %}
import PageObject from '../page-object';
{% endhighlight %}

The previous example assumes that your test file is one level deep under `tests/` folder. e.g. `tests/acceptance/login-test.js`.

## The .create method

To create a new PageObject definition use the `.create` method.

{% highlight js %}
var page = PageObject.create({
  // page attributes
});
{% endhighlight %}

You can define attributes using any JavaScript construct.

{% highlight js %}
var page = PageObject.create({
  title: function() {
    return $('.title').text();
  },

  text: 'A text'
});

assert.equal(page.title(), 'My title');
assert.equal(page.text, 'A text');
{% endhighlight %}

There are many special attributes defined under the PageObject _namespace_ that implement common patterns, for example, retrieving the text of an element.

{% highlight js %}
var page = PageObject.create({
  title: PageObject.text('.title')
});
{% endhighlight %}

The advantage of using this attribute for example is that it normalizes white spaces and trims the white spaces at both ends of the string. Like this attributes, there are many more that can help you write better page objects.
