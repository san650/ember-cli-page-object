'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy page-object', function() {
  setupTestHooks(this);

  it('generates a page-object in an ember app', function() {
    var args = ['page-object', 'foo'];

    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('tests/pages/foo.js'))
          .to.contain("from 'ember-cli-page-object';")
          .to.contain('export default create({');
    }));
  });

  it('generates a page-object in an ember addon', function() {
    var args = ['page-object', 'bar'];

    return emberNew({ target: 'addon' })
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('tests/pages/bar.js'))
          .to.contain("from 'ember-cli-page-object';")
          .to.contain('export default create({');
    }));
  });
});
