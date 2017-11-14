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

  included: function() {
    this.app = this._findHost();

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
  },

  _findHost() {
    let current = this;
    let app;

    do {
      app = current.app || app;
    } while (current.parent.parent && (current = current.parent));

    return app;
  }
};
