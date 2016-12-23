'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy component', function() {
  setupTestHooks(this);

  it('component foo', function() {
    var args = ['component', 'foo'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        // expect(file('app/type/foo.js')).to.contain('foo');
    }));
  });
});
