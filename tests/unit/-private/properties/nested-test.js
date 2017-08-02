import { moduleForProperty } from '../../../helpers/properties';
import { create, extend, nested } from 'ember-cli-page-object';

const ButtonPageObject = extend({
  isCool() {
    return this.text === 'cool';
  }
});

moduleForProperty('nested', function(test) {
  test('should set scope and context', function(assert) {
    let page = create({
      button: nested(ButtonPageObject, { scope: '.btn' })
    });

    this.adapter.createTemplate(this, page, 'Lorem <span class="btn">cool</span>');

    assert.ok(page.button.isCool);
  });
});
