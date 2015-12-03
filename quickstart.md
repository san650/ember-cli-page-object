---
layout: page
title: Quickstart
permalink: /quickstart/
---

Let's assume the following is your acceptance test to test the login form.

{% highlight html+handlebars %}
{% raw %}
<form>
  {{input id="username"}}
  {{input type="password" id="password"}}
  <button {{action 'login'}}>Log in</button>
</form>
{{#if error}}
  <p class="errors">
    {{error}}
  </p>
{{/if}}
{% endraw %}
{% endhighlight %}

{% highlight javascript %}
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

module('Acceptance | login', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('logs in sucessfully', function(assert) {
  visit('/login');
  fillIn('#username', 'admin');
  fillIn('#password', 'secret');
  click('form button');

  andThen(function() {
    assert.equal(currentURL(), '/private-page');
  });
});

test('shows error when password is wrong', function(assert) {
  visit('/login');
  fillIn('#username', 'admin');
  fillIn('#password', 'invalid');
  click('form button');

  andThen(function() {
    assert.equal(currentURL(), '/login');
    assert.equal($.trim(find('.errors').text()), 'Invalid credentials');
  });
});
{% endhighlight %}

Now we're going to convert this test to use a page object.

First, create a new page object

```
$ ember generate page-object login

installing
  create tests/pages/login.js
```

Then update the generated file to add the login page structure

```js
import PageObject from '../page-object';

let { clickable, fillable, text, visitable } = PageObject;

export default PageObject.build({
  visit: visitable('/'),

  username: fillable('#username'),
  password: fillable('#password'),
  submit: clickable('button'),
  error: text('.errors')
});
```

and then we use the page object from our acceptance test

```js
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import page from '../pages/users';

module('Acceptance | login', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('log in sucessfull', function(assert) {
  page
    .visit()
    .username('admin')
    .password('secret')
    .submit();

  andThen(function() {
    assert.equal(currentURL(), '/private-page');
  });
});

test('log in error', function(assert) {
  page
    .visit()
    .username('admin')
    .password('invalid')
    .submit();

  andThen(function() {
    assert.equal(page.error(), 'Invalid credentials');
  });
});
```

And that's it!
