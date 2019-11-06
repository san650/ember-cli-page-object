---
layout: page
title: Migrating to async/await
---
{% raw %}

When migrating to use `"@ember/test-helpers"`, you should take care to update all your "actions" usages to leverage `async`/`await` syntax.

## Manual steps

All the actions should be awaited now.

**Bad**
```js
test('page title', function(assert) {
  pages.visit({ id: 1 });

  assert.equal(user.title, 'First title')
})
```

**Good**
```js
test('page title', async function(assert) {
  await page.visit({ id: 1 });

  assert.equal(page.title, 'First title')
})
```

Custom methods using actions should also become async:

**Bad**
```js
export default {
  scope: 'form.login-form', 

  username: {
    scope: '[name=usename]'
  },

  password: {
    scope: '[type=password]'
  },

  submit: clickable('button'),

  login(username, password) {
    this.visit('/login');

    this.username.fillIn(username);
    this.password.fillIn(password);

    return this.submit();
  }
}
```

**Good**
```js
export default {
  scope: 'form.login-form', 

  username: {
    scope: '[name=usename]'
  },

  password: {
    scope: '[type=password]'
  },

  submit: clickable('button'),

  async login(username, password) {
    await this.visit('/login');

    await this.username.fillIn(username)
    await this.password.fillIn(password)

    return this.submit();
  }
}
```

{% endraw %}
