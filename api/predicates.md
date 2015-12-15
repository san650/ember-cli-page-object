---
layout: page
title: Predicates
permalink: /api/predicates/
---

Test conditions on elements

* [.hasClass](#hasclass)
* [.notHasClass](#nothasclass)
* [.isVisible](#isvisible)
* [.isHidden](#ishidden)
* [.contains](#contains)

## .hasClass

Returns `true` if the element has the css class.

__Attribute signature__

{% highlight js %}
PageObject.hasClass(cssClass, selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<img class="img is-active" src="...">
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  isImageActive: PageObject.hasClass('is-active', '.img')
});

assert.ok(page.isImageActive(), 'Image is active');
{% endhighlight %}

## .notHasClass

Returns `true` if the element doesn't have the css class.

__Attribute signature__

{% highlight js %}
PageObject.notHasClass(cssClass, selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<img class="img is-active" src="...">
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  isImageDeactivated: PageObject.notHasClass('is-active', '.img')
});

assert.ok(page.isImageDeactivated(), 'Image is not active');
{% endhighlight %}

## .isVisible

Returns `true` if the element exists and is visible.

__Attribute signature__

{% highlight js %}
PageObject.isVisible(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<img class="img" src="...">
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  isImageVisible: PageObject.isVisible('.img')
});

assert.ok(page.isImageVisible(), 'Image is visible');
{% endhighlight %}

## .isHidden

Returns `true` if the element doesn't exist or it exists and is hidden.

__Attribute signature__

{% highlight js %}
PageObject.isHidden(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<img class="img" style="display:none" src="...">
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  isImageHidden: PageObject.isHidden('.img')
});

assert.ok(page.isImageHidden(), 'Image is hidden');
{% endhighlight %}

## .contains

Returns `true` if the given text is found within element's text.

__Attribute signature__

{% highlight js %}
PageObject.contains(selector [, scope: ''])
{% endhighlight %}

__Example__

{% highlight html %}
<h1> Page Title </h1>
{% endhighlight %}

{% highlight js %}
var page = PageObject.create({
  titleIncludes: contains('h1')
});

assert.ok(page.titleIncludes('Page'));
{% endhighlight %}
