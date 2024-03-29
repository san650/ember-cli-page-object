'use strict';

let blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
let setupTestHooks = blueprintHelpers.setupTestHooks;
let emberNew = blueprintHelpers.emberNew;
let emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

let expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Blueprints: ember generate and destroy page-object-component', function () {
  setupTestHooks(this);

  it('generates a page-object component in an ember app', function () {
    var args = ['page-object-component', 'foo'];

    return emberNew().then(() =>
      emberGenerateDestroy(args, (file) => {
        expect(file('tests/pages/components/foo.js'))
          .to.contain("from 'ember-cli-page-object';")
          .to.contain('export default {');
      })
    );
  });

  it('generates a page-object component in an ember addon', function () {
    var args = ['page-object-component', 'foo'];

    return emberNew({ target: 'addon' }).then(() =>
      emberGenerateDestroy(args, (file) => {
        expect(file('tests/pages/components/foo.js'))
          .to.contain("from 'ember-cli-page-object';")
          .to.contain('export default {');
      })
    );
  });
});
