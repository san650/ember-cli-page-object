'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;
var modifyPackages = blueprintHelpers.modifyPackages;
var setupPodConfig = blueprintHelpers.setupPodConfig;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

var generateFakePackageManifest = require('../helpers/generate-fake-package-manifest');

describe('Blueprints: ember generate and destroy component-test', function() {
  setupTestHooks(this);

  describe('Run default component-test blueprint', function() {

    it('component-test x-foo', function() {
      var args = ['component-test', 'x-foo'];

      return emberNew()
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/integration/components/x-foo-test.js'))
            .to.contain("import { moduleForComponent, test } from 'ember-qunit';")
            .to.contain("import hbs from 'htmlbars-inline-precompile';")
            .to.contain("moduleForComponent('x-foo'")
            .to.contain("integration: true")
            .to.contain("{{x-foo}}")
            .to.contain("{{#x-foo}}");
        }));
    });

    it('component-test x-foo --pod', function() {
      var args = ['component-test', 'x-foo', '--pod'];

      return emberNew()
        .then(() => setupPodConfig({ podModulePrefix: true }))
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/integration/pods/components/x-foo/component-test.js'))
            .to.contain("import { moduleForComponent, test } from 'ember-qunit';")
            .to.contain("import hbs from 'htmlbars-inline-precompile';")
            .to.contain("moduleForComponent('x-foo'")
            .to.contain("integration: true")
            .to.contain("{{x-foo}}")
            .to.contain("{{#x-foo}}");
        }));
    });

    it('component-test x-foo --unit', function() {
      var args = ['component-test', 'x-foo', '--unit'];

      return emberNew()
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/unit/components/x-foo-test.js'))
            .to.contain("import { moduleForComponent, test } from 'ember-qunit';")
            .to.contain("moduleForComponent('x-foo'")
            .to.contain("unit: true");
        }));
    });

    it('dummy component-test x-foo', function() {
      var args = ['component-test', 'x-foo', '--dummy'];

      return emberNew({ target: 'addon' })
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/integration/components/x-foo-test.js'))
            .to.contain("import { moduleForComponent, test } from 'ember-qunit';")
            .to.contain("import hbs from 'htmlbars-inline-precompile';")
            .to.contain("moduleForComponent('x-foo'");

          expect(file('app/component-test/x-foo.js'))
            .to.not.exist;
        }));
    });

    it('component-test x-foo for mocha', function() {
      var args = ['component-test', 'x-foo'];

      return emberNew()
        .then(() => modifyPackages([
          {name: 'ember-cli-qunit', delete: true},
          {name: 'ember-cli-mocha', dev: true}
        ]))
        .then(() => generateFakePackageManifest('ember-cli-mocha', '0.11.0'))
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/integration/components/x-foo-test.js'))
            .to.contain("import { describeComponent, it } from 'ember-mocha';")
            .to.contain("import hbs from 'htmlbars-inline-precompile';")
            .to.contain("describeComponent('x-foo', 'Integration | Component | x foo'")
            .to.contain("integration: true")
            .to.contain("{{x-foo}}")
            .to.contain("{{#x-foo}}");
        }));
    });

    it('component-test x-foo --unit for mocha', function() {
      var args = ['component-test', 'x-foo', '--unit'];

      return emberNew()
        .then(() => modifyPackages([
          {name: 'ember-cli-qunit', delete: true},
          {name: 'ember-cli-mocha', dev: true}
        ]))
        .then(() => generateFakePackageManifest('ember-cli-mocha', '0.11.0'))
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/unit/components/x-foo-test.js'))
            .to.contain("import { describeComponent, it } from 'ember-mocha';")
            .to.contain("describeComponent('x-foo', 'Unit | Component | x foo")
            .to.contain("unit: true");
        }));
    });

    it('component-test x-foo for mocha v0.12+', function() {
      var args = ['component-test', 'x-foo'];

      return emberNew()
        .then(() => modifyPackages([
          {name: 'ember-cli-qunit', delete: true},
          {name: 'ember-cli-mocha', dev: true}
        ]))
        .then(() => generateFakePackageManifest('ember-cli-mocha', '0.12.0'))
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/integration/components/x-foo-test.js'))
            .to.contain("import { describe, it } from 'mocha';")
            .to.contain("import { setupComponentTest } from 'ember-mocha';")
            .to.contain("import hbs from 'htmlbars-inline-precompile';")
            .to.contain("describe('Integration | Component | x foo', function() {")
            .to.contain("setupComponentTest('x-foo', {")
            .to.contain("integration: true")
            .to.contain("{{x-foo}}")
            .to.contain("{{#x-foo}}");
        }));
    });

    it('component-test x-foo --unit for mocha v0.12+', function() {
      var args = ['component-test', 'x-foo', '--unit'];

      return emberNew()
        .then(() => modifyPackages([
          {name: 'ember-cli-qunit', delete: true},
          {name: 'ember-cli-mocha', dev: true}
        ]))
        .then(() => generateFakePackageManifest('ember-cli-mocha', '0.12.0'))
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/unit/components/x-foo-test.js'))
            .to.contain("import { describe, it } from 'mocha';")
            .to.contain("import { setupComponentTest } from 'ember-mocha';")
            .to.contain("describe('Unit | Component | x foo', function() {")
            .to.contain("setupComponentTest('x-foo', {")
            .to.contain("unit: true");
        }));
    });
    
  });

  describe('Run component-test blueprint with --page-object flag', function() {

    it('component-test x-foo', function() {
      var args = ['component-test', 'x-foo', '--page-object'];

      return emberNew()
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/integration/components/x-foo-test.js'))
            .to.contain("import { moduleForComponent, test } from 'ember-qunit';")
            .to.contain("import hbs from 'htmlbars-inline-precompile';")
            .to.contain("import xFoo from '../../pages/components/x-foo';")
            .to.contain("import { create } from 'ember-cli-page-object';")
            .to.contain("const component = create(xFoo);")
            .to.contain("moduleForComponent('x-foo'")
            .to.contain("integration: true")
            .to.contain("component.setContext(this);")
            .to.contain("component.removeContext();")
            .to.contain("{{x-foo}}")
            .to.contain("{{#x-foo}}");
        }));
    });

    it('component-test x-foo --pod', function() {
      var args = ['component-test', 'x-foo', '--page-object', '--pod'];

      return emberNew()
        .then(() => setupPodConfig({ podModulePrefix: true }))
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/integration/pods/components/x-foo/component-test.js'))
            .to.contain("import { moduleForComponent, test } from 'ember-qunit';")
            .to.contain("import hbs from 'htmlbars-inline-precompile';")
            .to.contain("import xFoo from '../../../../pages/components/x-foo';")
            .to.contain("import { create } from 'ember-cli-page-object';")
            .to.contain("const component = create(xFoo);")
            .to.contain("moduleForComponent('x-foo'")
            .to.contain("integration: true")
            .to.contain("component.setContext(this);")
            .to.contain("component.removeContext();")
            .to.contain("{{x-foo}}")
            .to.contain("{{#x-foo}}");

          expect(file('tests/pages/components/x-foo.js'))
            .to.contain("from 'ember-cli-page-object';")
            .to.contain('export default {');
        }));
    });

    it('component-test x-foo for mocha', function() {
      var args = ['component-test', 'x-foo', '--page-object'];

      return emberNew()
        .then(() => modifyPackages([
          {name: 'ember-cli-qunit', delete: true},
          {name: 'ember-cli-mocha', dev: true}
        ]))
        .then(() => generateFakePackageManifest('ember-cli-mocha', '0.11.0'))
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/integration/components/x-foo-test.js'))
            .to.contain("import { describeComponent, it } from 'ember-mocha';")
            .to.contain("import hbs from 'htmlbars-inline-precompile';")
            .to.contain("import { beforeEach, afterEach } from 'mocha';")
            .to.contain("import xFoo from '../../pages/components/x-foo';")
            .to.contain("import { create } from 'ember-cli-page-object';")
            .to.contain("describeComponent('x-foo', 'Integration | Component | x foo'")
            .to.contain("integration: true")
            .to.contain("component.setContext(this);")
            .to.contain("component.removeContext();")
            .to.contain("{{x-foo}}")
            .to.contain("{{#x-foo}}");

          expect(file('tests/pages/components/x-foo.js'))
            .to.contain("from 'ember-cli-page-object';")
            .to.contain('export default {');
        }));
    });

    it('component-test x-foo for mocha v0.12+', function() {
      var args = ['component-test', 'x-foo', '--page-object'];

      return emberNew()
        .then(() => modifyPackages([
          {name: 'ember-cli-qunit', delete: true},
          {name: 'ember-cli-mocha', dev: true}
        ]))
        .then(() => generateFakePackageManifest('ember-cli-mocha', '0.12.0'))
        .then(() => emberGenerateDestroy(args, file => {
          expect(file('tests/integration/components/x-foo-test.js'))
            .to.contain("import { describe, it, beforeEach, afterEach } from 'mocha';")
            .to.contain("import { setupComponentTest } from 'ember-mocha';")
            .to.contain("import hbs from 'htmlbars-inline-precompile';")
            .to.contain("import xFoo from '../../pages/components/x-foo';")
            .to.contain("import { create } from 'ember-cli-page-object';")
            .to.contain("describe('Integration | Component | x foo', function() {")
            .to.contain("setupComponentTest('x-foo', {")
            .to.contain("integration: true")
            .to.contain("component.setContext(this);")
            .to.contain("component.removeContext();")
            .to.contain("{{x-foo}}")
            .to.contain("{{#x-foo}}");

          expect(file('tests/pages/components/x-foo.js'))
            .to.contain("from 'ember-cli-page-object';")
            .to.contain('export default {');
        }));
    });

  });

});
