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

  included: function() {
    this.app = this._findHost();

    if (this._shouldIncludeFiles()) {
      if (!this.app.vendorFiles['jquery.js']) {
        this.import('vendor/ecpo-jquery/dist/jquery.js');
        this.import('vendor/shims/ecpo-jquery.js');
      } else {
        this.import('vendor/shims/project-jquery.js');
      }
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
    // TODO: In order to make the addon work in EmberTwiddle, we cannot use // the `tests` prop til
    // https://github.com/joostdevries/twiddle-backend/pull/28 is merged.
    // return !!this.app.tests;

    if(process.env && process.env.EMBER_CLI_FASTBOOT) {
      return false;
    } else {
      return this.app.env !== 'production';
    }
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
