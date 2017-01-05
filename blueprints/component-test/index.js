var path          = require('path');
var testInfo      = require('ember-cli-test-info');
var stringUtil    = require('ember-cli-string-utils');
var isPackageMissing = require('ember-cli-is-package-missing');
var getPathOption = require('ember-cli-get-component-path-option');
var useTestFrameworkDetector = require('../test-framework-detector');
var pathUtil      = require('ember-cli-path-utils');
var Promise       = require('rsvp').Promise;

module.exports = useTestFrameworkDetector({
  description: 'Generates a component integration or unit test, with optional support for page objects',

  availableOptions: [
    {
      name: 'test-type',
      type: ['integration', 'unit'],
      default: 'integration',
      aliases:[
        { 'i': 'integration'},
        { 'u': 'unit'},
        { 'integration': 'integration' },
        { 'unit': 'unit' }
      ]
    },
    {
      name: 'page-object',
      type: Boolean,
      default: false
    }
  ],

  fileMapTokens: function() {
    return {
      __testType__: function(options) {
        return options.locals.testType || 'integration';
      },
      __path__: function(options) {
        if (options.pod) {
          return path.join(options.podPath, options.locals.path, options.dasherizedModuleName);
        }
        return 'components';
      }
    };
  },
  locals: function(options) {
    var dasherizedModuleName = stringUtil.dasherize(options.entity.name);
    var componentPathName = dasherizedModuleName;
    var testType = options.testType || 'integration';
    var friendlyTestDescription = testInfo.description(options.entity.name, 'Integration', 'Component');
    var usePageObject = testType === 'integration' && options.pageObject;
    var localPath = getPathOption(options);
    var podModulePrefix = this.project.config().podModulePrefix || '';
    var podPath = podModulePrefix.substr(podModulePrefix.lastIndexOf('/') + 1);
    var fullPath = options.pod ? path.join(podPath, localPath, dasherizedModuleName) : 'components';
    var pageObjectPath = path.join(pathUtil.getRelativeParentPath(fullPath), '..', 'pages', 'components', componentPathName);

    if (options.pod && options.path && options.path !== 'components') {
      componentPathName = [options.path, dasherizedModuleName].join('/');
    }

    if (options.testType === 'unit') {
      friendlyTestDescription = testInfo.description(options.entity.name, 'Unit', 'Component');
    }

    return {
      path: localPath,
      testType: testType,
      componentPathName: componentPathName,
      friendlyTestDescription: friendlyTestDescription,
      usePageObject: usePageObject,
      pageObjectPath: pageObjectPath
    };
  },

  afterInstall: function(options) {
    var that = this;
    return Promise.resolve()
      .then(function() {
        if (options.pageObject) {
          return that._processBlueprint('install', 'page-object-component', options);
        }
      })
      .then(function() {
        if (!options.dryRun && options.testType === 'integration' && isPackageMissing(that, 'ember-cli-htmlbars-inline-precompile')) {
          return that.addPackagesToProject([
            { name: 'ember-cli-htmlbars-inline-precompile', target: '^0.3.1' }
          ]);
        }
      });
  },

  afterUninstall: function(options) {
    if (options.pageObject) {
      return this._processBlueprint('uninstall', 'page-object-component', options);
    }
  },

  _processBlueprint: function(type, name, options) {
    var mainBlueprint = this.lookupBlueprint(name);

    return Promise.resolve()
      .then(function() {
        return mainBlueprint[type](options);
      });
  }
});
