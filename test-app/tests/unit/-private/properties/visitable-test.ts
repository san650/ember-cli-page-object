import { setupApplicationTest } from '../../../helpers';
import { create, visitable } from 'ember-cli-page-object';
import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';

module('visitable', function(hooks) {
  setupApplicationTest(hooks);

  test("calls Ember's visit helper", async function(assert) {
    assert.expect(1);

    let expectedRoute = '/html-render';

    let page = create({
      foo: visitable(expectedRoute)
    });

    await page.foo();

    assert.equal(currentURL(), expectedRoute);
  });

  test('fills in dynamic segments', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: visitable('/users/:user_id/comments/:comment_id')
    });

    await page.foo({ user_id: 5, comment_id: 1 });
    assert.equal(currentURL(), '/users/5/comments/1')
  });

  test("raises an exception if params aren't given for all dynamic segments", async function(assert) {
    let page = create({
      foo: visitable('/users/:user_id')
    });

    assert.throws(() => page.foo(), /Missing parameter for \'user_id\'/);
    assert.throws(() => page.foo(), /page\.foo\(\)/);
  });

  test('appends query params to the path', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: visitable('/html-render')
    });

    await page.foo({ hello: 'world', lorem: 'ipsum' });
    assert.equal(currentURL(), '/html-render?hello=world&lorem=ipsum')
  });

  test('accepts both dynamic segments and query params', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: visitable('/users/:user_id/comments/:comment_id')
    });

    await page.foo({ user_id: 5, comment_id: 1, hello: 'world', lorem: 'ipsum' });
    assert.equal(currentURL(), '/users/5/comments/1?hello=world&lorem=ipsum');
  });

  test('fills in encoded dynamic segments', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: visitable('/users/:user_id/comments/:comment_id')
    });

    await page.foo({ user_id: 'a/user', comment_id: 1 });
    assert.equal(currentURL(), '/users/a%2Fuser/comments/1');
  });

  test('async error message', async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: visitable('/non-existing-url/:param')
    });

    assert.rejects(
      page.foo({ param: 'value'}) as unknown as Promise<unknown>,
      new Error(`Failed to visit URL '/non-existing-url/value'

PageObject: 'page.foo(\"[object Object]\")'
  Selector: '.scope'`)
    );
  });

});
