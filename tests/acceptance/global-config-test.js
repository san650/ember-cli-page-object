import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import PageObject from '../page-object';

moduleForAcceptance('Acceptance | global config', {
  afterEach() {
    PageObject.matchMultipleElements = false;
  }
});

var {
  text,
  visitable
} = PageObject;

var page = PageObject.create({
  visit: visitable('/login'),

  label: text('label'),
  firstLabel: text('label', { multiple: false })
});

test('Multiple matched elements throw error by default', function(assert) {
  page.visit();

  andThen(function() {
    assert.throws(() => page.label(), 'Multiple elements matched error');
  });
});

test('Global config enables multiple element matching', function(assert) {
  PageObject.matchMultipleElements = true;

  page.visit();

  andThen(function() {
    assert.equal(page.label(), 'User name Password', 'Returns all matched elements text');
  });
});

test("'multiple' options overrides global config", function(assert) {
  PageObject.matchMultipleElements = true;

  page.visit();

  andThen(function() {
    assert.throws(() => page.firstLabel(), 'Multiple elements matched error');
  });
});
