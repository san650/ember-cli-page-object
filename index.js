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
      },
      jquery: function() {
        return {
          enabled: this._shouldIncludeFiles(),
          vendor: ['dist/jquery.js'],
          destDir: 'ecpo-jquery'
        }
      }
    }
  },

  included: function(app) {
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    if (this._shouldIncludeFiles()) {
      this.import('vendor/ecpo-jquery/dist/jquery.js', {
        prepend: true
      });
    }

    this._super.included.apply(this, arguments);
  },

  treeFor: function(/*name*/) {
    if (!this._shouldIncludeFiles()) {
      return;
    }

    return this._super.treeFor.apply(this, arguments);
  },

  _shouldIncludeFiles: function() {
    return !!this.app.tests;
  }
};
