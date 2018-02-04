import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import PageObject from 'dummy/tests/page-object';

// In the old ember testing API we have a `render` method available
// only in the `moduleForComponent` test helper. Unfortunatelly it requires
// some component name to be passed as a first argument. That's why we pass
// a `calculating-device` here despite the fact that we don't actually need it.
moduleForComponent('calculating-device', 'Integration | comma separated selectors', {
  integration: true
});

test('usage of comma-separated selector in the scope leads to a deprecation', function(assert) {
  let page = PageObject.create({
    context: this,
    scope: '.A, .B'
  });

  this.render(hbs`<div class="B"></div>`);

  page.isVisible;

  assert.expectDeprecation('Usage of comma separated selectors is deprecated in ember-cli-page-object');
});

test('usage of comma-separated selector in the property leads to a deprecation', function(assert) {
  let page = PageObject.create({
    context: this,
    text: PageObject.text('.A, .B')
  });

  this.render(hbs`<div class="A"></div>`);

  page.text;

  assert.expectDeprecation('Usage of comma separated selectors is deprecated in ember-cli-page-object');
});

test('usage of comma-separated selector in the property\'s custom scope leads to a deprecation', function(assert) {
  let page = PageObject.create({
    context: this,
    text: PageObject.text('.root', {
      scope: '.A, .B'
    })
  });

  this.render(hbs`<div class="root">
    <div class="A"></div>
  </div>`);

  page.text;

  assert.expectDeprecation('Usage of comma separated selectors is deprecated in ember-cli-page-object');
});

test('don\'t show deprecation when selector doesn\'t use comma-separated selectors', function(assert) {
  let page = PageObject.create({
    context: this,
    scope: '.root',
    propText: PageObject.text('.A', {
      scope: '.B'
    })
  });

  this.render(hbs`<div class="root">
    <div class="B">
      <div class="A"></div>
    </div>
  </div>`);

  page.text;

  assert.expectNoDeprecation();
});
