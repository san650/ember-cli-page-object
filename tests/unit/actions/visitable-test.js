import { test } from 'qunit';
import { moduleFor } from '../test-helper';
import { create, visitable } from '../../page-object';

moduleFor('Unit | Property | .visitable');

test('calls Ember\'s visit helper', function(assert) {
  assert.expect(1);

  let expectedRoute = '/dummy-page';

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, expectedRoute);
  };

  let page = create({
    foo: visitable(expectedRoute)
  });

  page.foo();
});

test('fills in dynamic segments', function(assert) {
  assert.expect(1);

  let page;

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, '/users/5/comments/1');
  };

  page = create({
    foo: visitable('/users/:user_id/comments/:comment_id')
  });

  page.foo({ user_id: 5, comment_id: 1 });
});

test("raises an exception if params aren't given for all dynamic segments", function(assert) {
  assert.expect(1);

  let page;

  try {
    page = create({
      foo: visitable('/users/:user_id')
    });

    page.foo();
  } catch(e) {
    assert.equal(e.message, "Missing parameter for 'user_id'");
  }
});

test('appends query params to the path', function(assert) {
  assert.expect(1);

  let page;

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, '/dummy-page?hello=world&lorem=ipsum');
  };

  page = create({
    foo: visitable('/dummy-page')
  });

  page.foo({ hello: 'world', lorem: 'ipsum' });
});

test('accepts both dynamic segments and query params', function(assert) {
  assert.expect(1);

  let page;

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, '/users/1/0?hello=world&lorem=ipsum');
  };

  page = create({
    foo: visitable('/users/:user_id/:another_id')
  });

  page.foo({ user_id: 1, another_id: 0, hello: 'world', lorem: 'ipsum' });
});
