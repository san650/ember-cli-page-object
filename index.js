'use strict';

module.exports = {
  name: 'ember-cli-page-object',

  options: {
    nodeAssets: {
      ceibo: {
        vendor: ['index.js']
      },
      jquery: {
        vendor: ['dist/jquery.js'],
        destDir: 'ecpo-jquery'
      }
    }
  },

  included() {
    this.app = this._findHost();

    this.import('vendor/ceibo/index.js', { type: 'test' });

    if (!this.app.vendorFiles['jquery.js']) {
      this.import('vendor/ecpo-jquery/dist/jquery.js', { type: 'test' });
      this.import('vendor/shims/ecpo-jquery.js', { type: 'test' });
    } else {
      this.import('vendor/shims/project-jquery.js', { type: 'test' });
    }

    this._super.included.apply(this, arguments);
  },

  treeForAddonTestSupport(tree) {
    // intentionally not calling _super here
    // so that can have our `import`'s be
    // import { clickable } from 'ember-cli-page-object';

    const Funnel = require('broccoli-funnel');
    const mergeTrees = require('broccoli-merge-trees');

    let publicExportsTree = new Funnel(tree, {
      srcDir: '/--re-exports',
      destDir: `/${this.moduleName()}`,
      annotation: `Addon#treeForTestSupport (${this.name})`,
    });

    let testSupportTree = new Funnel(tree, {
      srcDir: '/',
      exclude: ['/--re-exports'],
      destDir: `/${this.moduleName()}/test-support`,
      annotation: `Addon#treeForTestSupport (${this.name})`,
    });

    return this.preprocessJs(
      mergeTrees([ publicExportsTree, testSupportTree ]),
      '/',
      this.name,
      { registry: this.registry, }
    );
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
