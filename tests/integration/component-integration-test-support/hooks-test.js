import { moduleForComponent, test } from 'ember-qunit';
import { createTemplate } from '../test-helper';

import PageObject from 'dummy/tests/page-object';

const page = PageObject.create({});

let firstThis;
let secondThis;

moduleForComponent('calculating-device', 'Integration | component integration test support/hooks', {
  integration: true,

  beforeEach() {
    page.setContext(this);

    if (!firstThis) {
      firstThis = page.context;
    } else {
      secondThis = page.context;
    }
  },

  afterEach() {
    page.removeContext();
  }
});

test('When set in the `beforeEach()` qunit hook, test\'s `this` context\'s methods are accessible to the page object', function(assert) {
  assert.expect(5);

  assert.ok(page.context);
  assert.deepEqual(this, page.context);
  assert.equal(page.context, firstThis);

  this.render(createTemplate());

  assert.ok(page.context.$());
  assert.deepEqual(page.context.$(), this.$());
});

test('Setting the page\'s context in `beforeEach()` assigns the correct context in each test', function(assert) {
  assert.expect(6);

  assert.ok(page.context);
  assert.deepEqual(this, page.context);
  assert.equal(page.context, secondThis);
  assert.notEqual(page.context, firstThis);

  this.render(createTemplate());

  assert.ok(page.context.$());
  assert.deepEqual(page.context.$(), this.$());
});
