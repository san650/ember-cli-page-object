/* jshint node: true */
'use strict';

module.exports = {
  name: 'page-object',

  included: function(app) {
    this._super.included(app);

    this.app = app;
    this.addonConfig = this.app.project.config(app.env)['ember-cli-page-object'] || {};
    this.addonBuildConfig = this.app.options['ember-cli-page-object'] || {};

    if (this._shouldIncludeFiles()) {
      app.import(app.bowerDirectory + '/ceibo/index.js');
    }
  },

  treeFor: function(/*name*/) {
    if (!this._shouldIncludeFiles()) {
      return;
    }

    return this._super.treeFor.apply(this, arguments);
  },

  _shouldIncludeFiles: function() {
    return (
      this.app.env !== 'production'
      || (
        this.app.env === 'production'
        && this.addonConfig.enabledInProd
      )
    );
  }
};
