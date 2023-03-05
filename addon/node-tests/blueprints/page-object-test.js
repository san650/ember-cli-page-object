'use strict';

let blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
let setupTestHooks = blueprintHelpers.setupTestHooks;
let emberNew = blueprintHelpers.emberNew;
let emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

let expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Blueprints: ember generate and destroy page-object', function () {
  setupTestHooks(this);

  it('generates a page-object in an ember app', function () {
    let args = ['page-object', 'foo'];

    return emberNew().then(() =>
      emberGenerateDestroy(args, (file) => {
        expect(file('tests/pages/foo.js'))
          .to.contain("from 'ember-cli-page-object';")
          .to.contain('export default create({');
      })
    );
  });

  it('generates a page-object in an ember addon', function () {
    let args = ['page-object', 'bar'];

    return emberNew({ target: 'addon' }).then(() =>
      emberGenerateDestroy(args, (file) => {
        expect(file('tests/pages/bar.js'))
          .to.contain("from 'ember-cli-page-object';")
          .to.contain('export default create({');
      })
    );
  });
});
