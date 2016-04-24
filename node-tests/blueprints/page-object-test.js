'use strict';

var setupTestHooks     = require('ember-cli-blueprint-test-helpers/lib/helpers/setup');
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/lib/helpers/blueprint-helper');
var generateAndDestroy = BlueprintHelpers.generateAndDestroy;

describe('Acceptance: ember generate and destroy page-object', function() {
  setupTestHooks(this);

  it('generates a page-object blueprint in an ember app', function() {
    // pass any additional command line options in the arguments array
    return generateAndDestroy(['page-object', 'foo'], {
      // define files to assert, and their contents
      target: 'app',
      files: [{
        file: 'tests/pages/foo.js',
        contains: [
          'import {',
          '  create,',
          '  visitable',
          "} from 'ember-cli-page-object';",
          '',
          'export default create({',
          "  visit: visitable('/')",
          '});'
        ]
      }]
    });
  });

  it('generates a page-object blueprint in an ember addon', function() {
    // pass any additional command line options in the arguments array
    return generateAndDestroy(['page-object', 'bar'], {
      // define files to assert, and their contents
      target: 'addon',
      files: [{
        file: 'tests/pages/bar.js',
        contains: [
          'import {',
          '  create,',
          '  visitable',
          "} from 'ember-cli-page-object';",
          '',
          'export default create({',
          "  visit: visitable('/')",
          '});'
        ]
      }]
    });
  });
});
