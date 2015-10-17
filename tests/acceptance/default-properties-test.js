import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import PageObject from '../page-object';

module('Acceptance | default properties', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

var {
  visitable
} = PageObject;

test('Adds default properties', function(assert) {
  var page = PageObject.build({
    visit: visitable('/calculator'),

    one: {
      scope: '.numbers button:nth-of-type(1)'
    },

    screen: {
      scope: '.screen'
    }
  });

  page
    .visit()
    .clickOn('9')
    .one()
    .click();

  andThen(function() {
    assert.equal(page.screen().text(), '91', 'text');
    assert.ok(page.screen().contains('91'), 'contains');
    assert.ok(!page.screen().contains('99'), 'not contains');
    assert.ok(page.screen().isVisible(), 'isVisible');
    assert.ok(!page.screen().isHidden(), 'isHidden');
  });
});

test('Overrides default properties', function(assert) {
  var page = PageObject.build({
    dummy: {
      isHidden() {
        return 'isHidden';
      },
      isVisible() {
        return 'isVisible';
      },
      clickOn() {
        return 'clickOn';
      },
      click() {
        return 'click';
      },
      contains() {
        return 'contains';
      },
      text() {
        return 'text';
      }
    }
  });

  andThen(function() {
    assert.equal(page.dummy().isHidden(), 'isHidden');
    assert.equal(page.dummy().isVisible(), 'isVisible');
    assert.equal(page.dummy().clickOn(), 'clickOn');
    assert.equal(page.dummy().click(), 'click');
    assert.equal(page.dummy().contains(), 'contains');
    assert.equal(page.dummy().text(), 'text');
  });
});
