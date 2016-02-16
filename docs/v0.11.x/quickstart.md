---
layout: page
title: Quickstart
---

Suppose we have a couple of acceptance tests to test the login page of our site.

{% highlight js %}
test('logs in sucessfully', function(assert) {
  visit('/login');
  fillIn('#username', 'admin');
  fillIn('#password', 'secret');
  click('button');

  andThen(function() {
    assert.equal(currentURL(), '/private-page');
  });
});

test('shows an error when password is wrong', function(assert) {
  visit('/login');
  fillIn('#username', 'admin');
  fillIn('#password', 'invalid');
  click('button');

  andThen(function() {
    assert.equal(currentURL(), '/login');
    assert.equal($.trim(find('.errors').text()), 'Invalid credentials');
  });
});
{% endhighlight %}

We want to convert this test to use a page object, so, the first thing we need to do is to create a new page object. For this we'll use one of the generators that comes with the addon.

{% highlight bash %}
$ ember generate page-object login

installing
  create tests/pages/login.js
{% endhighlight %}

The generator created a file inside `/tests/pages` folder. Let's describe the login page structure on our new page object.

{% highlight js %}
import PageObject from '../page-object';

const { clickable, fillable, text, visitable } = PageObject;

export default PageObject.create({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors')
});
{% endhighlight %}

Now the only step left is to include the page object on our test and use it

{% highlight javascript %}
import page from '../pages/login';

...

test('logs in sucessfully', function(assert) {
  page
    .visit()
    .username('admin')
    .password('secret')
    .submit();

  andThen(function() {
    assert.equal(currentURL(), '/private-page');
  });
});

test('shows an error when password is wrong', function(assert) {
  page
    .visit()
    .username('admin')
    .password('invalid')
    .submit();

  andThen(function() {
    assert.equal(page.error(), 'Invalid credentials');
  });
});
{% endhighlight %}

We can go a step further and describe the steps of the test using higher level of abstraction. Let's see an example of this

{% highlight js %}
import PageObject from '../page-object';

const { clickable, fillable, text, visitable } = PageObject;

export default PageObject.create({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors'),

  loginSuccessfully() {
    return this.visit()
      .username('admin')
      .password('secret')
      .submit();
  },

  loginFailed() {
    return this.visit()
      .username('admin')
      .password('invalid')
      .submit();
  }
});
{% endhighlight %}

And update the test accordingly

{% highlight js %}
test('logs in sucessfully', function(assert) {
  page.loginSuccessfully();

  andThen(function() {
    assert.equal(currentURL(), '/private-page');
  });
});

test('shows an error when password is wrong', function(assert) {
  page.loginFailed();

  andThen(function() {
    assert.equal(page.error(), 'Invalid credentials');
  });
});
{% endhighlight %}

And that's it! Now we have cleaner, more maintainable and easier to read tests.
