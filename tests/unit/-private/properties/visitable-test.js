import { moduleForProperty } from '../../../helpers/properties';
import { create, visitable } from 'ember-cli-page-object';

moduleForProperty('visitable', { needsVisit: true }, function(test) {
  test("calls Ember's visit helper", async function(assert) {
    assert.expect(1);

    let expectedRoute = '/html-render';

    let page = create({
      foo: visitable(expectedRoute)
    });

    await this.adapter.await(page.foo());
    assert.equal(this.adapter.currentURL(), expectedRoute);
  });

  test('fills in dynamic segments', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: visitable('/users/:user_id/comments/:comment_id')
    });

    await this.adapter.await(page.foo({ user_id: 5, comment_id: 1 }));
    assert.equal(this.adapter.currentURL(), '/users/5/comments/1')
  });

  test("raises an exception if params aren't given for all dynamic segments", async function(assert) {
    assert.expect(1);

    let page;

    try {
      page = create({
        foo: visitable('/users/:user_id')
      });

      await this.adapter.await(page.foo());
    } catch(e) {
      assert.equal(e.message, "Missing parameter for 'user_id'");
    }
  });

  test('appends query params to the path', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: visitable('/html-render')
    });

    await this.adapter.await(page.foo({ hello: 'world', lorem: 'ipsum' }));
    assert.equal(this.adapter.currentURL(), '/html-render?hello=world&lorem=ipsum')
  });

  test('accepts both dynamic segments and query params', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: visitable('/users/:user_id/comments/:comment_id')
    });

    await this.adapter.await(page.foo({ user_id: 5, comment_id: 1, hello: 'world', lorem: 'ipsum' }));
    assert.equal(this.adapter.currentURL(), '/users/5/comments/1?hello=world&lorem=ipsum');
  });

  test('fills in encoded dynamic segments', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: visitable('/users/:user_id/comments/:comment_id')
    });

    await this.adapter.await(page.foo({ user_id: 'a/user', comment_id: 1 }));
    assert.equal(this.adapter.currentURL(), '/users/a%2Fuser/comments/1');
  });
});
