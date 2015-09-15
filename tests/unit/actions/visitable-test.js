import { test } from 'qunit';
import { moduleFor, buildProperty } from '../test-helper';
import visitable from '../../page-object/properties/visitable';

moduleFor('Actions', 'visitable');

test('calls Ember\'s visit helper', function(assert) {
  assert.expect(1);

  let expectedRoute = '/dummy-page',
      property;

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, expectedRoute);
  };

  property = buildProperty(visitable(expectedRoute));
  property.invoke();
});

test('fills in dynamic segments', function(assert) {
  assert.expect(1);

  let property;

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, '/users/5/comments/1');
  };

  property = buildProperty(visitable('/users/:user_id/comments/:comment_id'));
  property.invoke({ user_id: 5, comment_id: 1 });
});

test("raises an exception if params aren't given for all dynamic segments", function(assert) {
  assert.expect(1);

  let property;

  try {
    property = buildProperty(visitable('/users/:user_id'));
    property.invoke();
  } catch(e) {
    assert.equal(e.message, "Missing parameter for 'user_id'");
  }
});

test('appends queryParams to the path', function(assert) {
  assert.expect(1);

  let property;

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, '/dummy-page?hello=world&lorem=ipsum');
  };

  property = buildProperty(visitable('/dummy-page'));
  property.invoke({}, { hello: "world", lorem: "ipsum" });
});
