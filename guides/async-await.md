---
layout: page
title: Migrating to async/await
---
{% raw %}

If you migrate to `"@ember/test-helpers"` you should take care to update all your "actions" usages to leaverage `async`/`await` syntax.

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
  scope, 

  username: fillable('[name=usename]'),
  password: fillable('[type=password]'),
  submit: clickable('button'),

  login(username, password) {
    this.visit('/login')
      .username(username)
      .password(password)
      .submit();
  }
}
```

**Good**
```js
export default {
  scope, 

  username: fillable('[name=usename]'),
  password: fillable('[type=password]'),
  submit: clickable('button'),

  async login(username, password) {
    await this.visit('/login');
      .username(username)
      .password(password)
      .submit();
  }
}
```

{% endraw %}
