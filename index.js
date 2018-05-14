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
    const testSupportTree = this._super(tree);

    const mergeTrees = require('broccoli-merge-trees');
    const writeFile = require('broccoli-file-creator');

    // Generate re-exports for public modules to allow
    // import w/o "test-support/" part in the path:
    //
    // `import { clickable } from 'ember-cli-page-object';`
    //
    // instead of:
    //
    // `import { clickable } from 'ember-cli-page-object/test-support';`
    //
    // which is a default behavior in ember-cli
    const reexportsTree = mergeTrees([
      'index',
      'extend',
      'macros',
      '-private/execution_context' // @see: https://github.com/san650/ember-cli-page-object/pull/400#issuecomment-384021927
    ].map(publicModuleName =>
      writeFile(
        `/${this.moduleName()}/${publicModuleName}.js`,
        `export * from '${this.moduleName()}/test-support/${publicModuleName}';`
      )
    ));

    return mergeTrees([
      testSupportTree,
      this.preprocessJs(
        reexportsTree, '/', this.name, { registry: this.registry, }
      )
    ]);
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
