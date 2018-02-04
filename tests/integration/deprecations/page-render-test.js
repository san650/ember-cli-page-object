import { moduleForComponent, test } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { create } from 'ember-cli-page-object';

moduleForComponent('calculating-device', 'Deprecation | page.render()', {
  integration: true,

  beforeEach() {
    this.page = create({
      context: this
    });
  }
});

test('page.render() leads to the deprecation', function(assert) {
  this.page.render(hbs``);

  assert.expectDeprecation('PageObject.render() is deprecated. Please use "htmlbars-inline-precompile" instead.')
});
