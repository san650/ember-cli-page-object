import { setupApplicationTest } from '../../../helpers';
import { create, visitable } from 'ember-cli-page-object';
import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';

module('visitable', function (hooks) {
  setupApplicationTest(hooks);

  test("calls Ember's visit helper", async function (assert) {
    assert.expect(1);

    const expectedRoute = '/html-render';

    const page = create({
      foo: visitable(expectedRoute),
    });

    await page.foo();

    assert.equal(currentURL(), expectedRoute);
  });

  test('fills in dynamic segments', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: visitable('/users/:user_id/comments/:comment_id'),
    });

    await page.foo({ user_id: 5, comment_id: 1 });
    assert.equal(currentURL(), '/users/5/comments/1');
  });

  test("raises an exception if params aren't given for all dynamic segments", async function (assert) {
    const page = create({
      foo: visitable('/users/:user_id'),
    });

    assert.throws(() => page.foo(), /Missing parameter for 'user_id'/);
    assert.throws(() => page.foo(), /page\.foo\(\)/);
  });

  test('appends query params to the path', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: visitable('/html-render'),
    });

    await page.foo({ hello: 'world', lorem: 'ipsum' });
    assert.equal(currentURL(), '/html-render?hello=world&lorem=ipsum');
  });

  test('accepts both dynamic segments and query params', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: visitable('/users/:user_id/comments/:comment_id'),
    });

    await page.foo({
      user_id: 5,
      comment_id: 1,
      hello: 'world',
      lorem: 'ipsum',
      reply_ids: [1, 2],
      search: {
        author: 'ember',
        topic: 'lts',
        deep: {
          my_array: [99, 77],
          my_value: true,
        },
      },
    });

    assert.equal(
      decodeURIComponent(currentURL()),
      '/users/5/comments/1' +
        '?hello=world&lorem=ipsum' +
        '&reply_ids[]=1&reply_ids[]=2' +
        '&search[author]=ember&search[topic]=lts' +
        '&search[deep][my_array][]=99&search[deep][my_array][]=77&search[deep][my_value]=true'
    );
  });

  test('fills in encoded dynamic segments', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: visitable('/users/:user_id/comments/:comment_id'),
    });

    await page.foo({ user_id: 'a/user', comment_id: 1 });
    assert.equal(currentURL(), '/users/a%2Fuser/comments/1');
  });

  test('async error message', async function (assert) {
    const page = create({
      scope: '.scope',
      foo: visitable('/non-existing-url/:param'),
    });

    try {
      await page.foo({ param: 'value' });

      assert.false(true, 'visit should have failed');
    } catch (e) {
      assert.strictEqual(
        e?.toString(),
        `Error: Failed to visit URL '/non-existing-url/value': UnrecognizedURLError: /non-existing-url/value

PageObject: 'page.foo("[object Object]")'
  Selector: '.scope'`
      );

      const originalError = (e as any).cause.error;
      assert.true(
        originalError instanceof Error,
        '`cause.error` is an instance of `Error`'
      );

      assert.strictEqual(originalError.name, 'UnrecognizedURLError');

      assert.strictEqual(originalError.message, '/non-existing-url/value');
    }
  });
});
