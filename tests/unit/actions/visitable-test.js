import {
  buildAttribute,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { visitable } from '../../page-object/actions';

let OriginalVisit = window.visit;

moduleFor('Actions', 'visitable', {
  afterEach: function() {
    window.visit = OriginalVisit;
  }
});

itBehavesLikeAnAttribute(visitable);

it('calls Ember\'s visit helper', function(assert) {
  assert.expect(1);

  let expectedRoute = '/dummy-page';

  window.visit = function(actualRoute) {
    assert.equal(actualRoute, expectedRoute);
  };

  buildAttribute(visitable, expectedRoute)();
});
