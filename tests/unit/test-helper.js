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
