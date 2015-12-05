---
layout: page
title: Queries
permalink: /api/queries/
---

Retrieve values from elements

* [.attribute](#attribute)
* [.count](#count)
* [.text](#text)
* [.textList](#text-list)
* [.value](#value)


## .attribute

Returns the value of a element's attribute.

__Attribute signature__

{% highlight js %}
PageObject.attribute(attributeName, selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<img class="img" alt="Logo" src="...">
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  imageAlternateText: PageObject.attribute('alt', '.img')
});

assert.equal(page.imageAlternateText(), 'Logo');
{% endhighlight %}

## .count

Returns the count of elements that match the css selector.

__Attribute signature__

{% highlight js %}
PageObject.count(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<img class="img" src="...">
<img class="img" src="...">
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  imageCount: PageObject.count('.img')
});

assert.equal(page.imageCount(), 2);
{% endhighlight %}

## .text

Returns the inner text of the element. Note that whitespace from the beginning and end of the string is removed for convenience.

__Attribute signature__

{% highlight js %}
PageObject.text(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<h1>Page title</h1>
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  title: PageObject.text('h1')
});

assert.equal(page.title(), 'Page title');
{% endhighlight %}

## .textList

Returns the inner text of all elements matched by the provided selector. The result is returned as a list.

__Attribute signature__

{% highlight js %}
PageObject.textList(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<ul>
  <li>John</li>
  <li>Jane</li>
</ul>
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  userNameList: PageObject.textList('li')
});

assert.equal(page.userNameList()[0], 'John');
{% endhighlight %}

## .value

Returns the value of an input.

__Attribute signature__

{% highlight js %}
PageObject.value(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<input id="name" value="John Doe" />
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  name: PageObject.value('#name')
});

assert.equal(page.name(), 'John Doe');
{% endhighlight %}
