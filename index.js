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
      this.importJquery();
    }

    this._super.included.apply(this, arguments);
  },

  /*
   * Import an amd '-jquery' shim which is used by ember-cli-page-object internally
   * 
   * We don't want ember-cli-page-object's jquery ocassionaly leak into a real application.
   * The following combo of shims supposed to isolate `ember-cli-page-object`'s `jquery` 
   * from the rest of application and expose internal version via amd module.
   */
  importJquery: function() {
    // jquery itself is included in the very beggining of vendor.js.
    // At this point we don't have `define()` defined so we can't create an amd shim here.
    //
    // However we have to store reference to jquery and dispose it from the window
    // in order to prevent its leakage to the application.
    this.import('vendor/shims/ecpo-jquery-global.js', {
      prepend: true
    });
    this.import('vendor/ecpo-jquery/dist/jquery.js', {
      prepend: true
    });

    // finally define an amd shim for our internal jquery version
    this.import('vendor/shims/ecpo-jquery.js');
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
