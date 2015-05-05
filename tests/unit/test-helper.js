import { module, test } from 'qunit';

function findWithAssert(selector) {
  var element = $('#ember-testing').find(selector);

  if (element.length === 0) {
    throw 'Element not found';
  }

  return element;
}

export function moduleFor(category, helperName) {
  module(`${category} - .${helperName}`, {
    beforeEach: function() {
      // Mock findWithAssert
      window.findWithAssert = findWithAssert;
    },

    afterEach: function() {
      // Delete mock
      delete window.findWithAssert;

      // Cleanup DOM
      $('#ember-testing').html('');
    }
  });
}

export function itBehavesLikeAnAttribute(attribute) {
  it('responds to build', function(assert) {
    var builder = attribute();

    assert.ok($.isFunction(builder.build), '`build` is a function');
  });

  it('returns a builder function', function(assert) {
    var builder = attribute(),
        predicate = builder.build('dummy', {});

    assert.ok($.isFunction(predicate), '`build()` is a function');
  });
}

export function buildAttribute(attribute, ...params) {
  return attribute(...params).build('key', {});
}

export function buildAttributeWithOptions(attribute, page, ...params) {
  return attribute(...params).build('key', page);
}

export function it(description, fn) {
  test(`it ${description}`, fn);
}

export function fixture(str) {
  $('#ember-testing').html(str);
}
