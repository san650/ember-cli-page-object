/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-page-object',

  options: {
    nodeAssets: {
      ceibo: function() {
        return {
          enabled: this._shouldIncludeFiles(),
          import: ['index.js']
        };
      }
    }
  },

  treeFor: function(/*name*/) {
    if (!this._shouldIncludeFiles()) {
      return;
    }

    return this._super.treeFor.apply(this, arguments);
  },

  _shouldIncludeFiles: function() {
    return this.app.env !== 'production';
  }
};
