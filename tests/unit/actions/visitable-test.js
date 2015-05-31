import {
  buildAttribute,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { visitableAttribute } from '../../page-object/actions';

let OriginalVisit = window.visit;

moduleFor('Actions', 'visitableAttribute', {
  afterEach: function() {
    window.visit = OriginalVisit;
  }
});

itBehavesLikeAnAttribute(visitableAttribute);

it('calls Ember\'s visit helper', function(assert) {
  assert.expect(1);

  let expectedRoute = '/dummy-page';

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, expectedRoute);
  };

  buildAttribute(visitableAttribute, expectedRoute)();
});

it('fills in dynamic segments', function(assert) {
  assert.expect(1);

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, '/users/5/comments/1');
  };

  buildAttribute(visitableAttribute, '/users/:user_id/comments/:comment_id')({
    user_id: 5,
    comment_id: 1
  });
});

it("raises an exception if params aren't given for all dynamic segments", function(assert) {
  assert.expect(1);

  try {
    buildAttribute(visitableAttribute, '/users/:user_id')();
  } catch(e) {
    assert.equal(e.message, "Missing parameter for 'user_id'");
  }
});
