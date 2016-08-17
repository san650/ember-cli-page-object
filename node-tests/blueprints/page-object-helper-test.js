'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy page-object-helper', function() {
  setupTestHooks(this);

  it('generates a page-object-helper in an ember app', function() {
    var args = ['page-object-helper', 'foo-bar'];

    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('tests/pages/helpers/foo-bar.js'))
        .to.contain('ember-cli-page-object/extend')
        .to.contain('function fooBar');
    }));
  });

  it('generates a page-object-helper in an ember addon', function() {
    var args = ['page-object-helper', 'bar-baz'];

    return emberNew({ target: 'addon' })
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('tests/pages/helpers/bar-baz.js'))
        .to.contain('ember-cli-page-object/extend')
        .to.contain('function barBaz');
    }));
  });
});
