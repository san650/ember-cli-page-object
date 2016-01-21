var stringUtils = require('ember-cli-string-utils');

module.exports = {
  locals: function(options) {
    var folder = stringUtils.dasherize(options.project.name()) + '/tests/page-object';

    return {
      pageObjectsRoot: folder,
    };
  }
}
