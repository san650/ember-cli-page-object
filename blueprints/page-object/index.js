var stringUtils = require('ember-cli-string-utils');

module.exports = {
  description: 'Generates a page object for acceptance tests.',
  locals: function(options) {
    var testFolderRoot = stringUtils.dasherize(options.project.name());

    return {
      testFolderRoot: testFolderRoot,
    };
  }
};
