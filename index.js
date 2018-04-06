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

  included() {
    this.app = this._findHost();

    if (this._shouldIncludeFiles()) {
      if (!this.app.vendorFiles['jquery.js']) {
        this.import('vendor/ecpo-jquery/dist/jquery.js', { type: 'test' });
        this.import('vendor/shims/ecpo-jquery.js', { type: 'test' });
      } else {
        this.import('vendor/shims/project-jquery.js', { type: 'test' });
      }
    }

    this._super.included.apply(this, arguments);
  },

  treeFor(/*name*/) {
    if (!this._shouldIncludeFiles()) {
      return;
    }

    return this._super.treeFor.apply(this, arguments);
  },

  treeForAddonTestSupport(tree) {
    // intentionally not calling _super here
    // so that can have our `import`'s be
    // import { clickable } from 'ember-cli-page-object';

    const Funnel = require('broccoli-funnel');

    let namespacedTree = new Funnel(tree, {
      srcDir: '/',
      destDir: `/${this.moduleName()}`,
      annotation: `Addon#treeForTestSupport (${this.name})`,
    });

    return this.preprocessJs(namespacedTree, '/', this.name, {
      registry: this.registry,
    });
  },

  _shouldIncludeFiles() {
    // TODO: In order to make the addon work in EmberTwiddle, we cannot use // the `tests` prop til
    // https://github.com/joostdevries/twiddle-backend/pull/28 is merged.
    // return !!this.app.tests;

    return this.app.env !== 'production';
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
