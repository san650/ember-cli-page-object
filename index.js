'use strict';

module.exports = {
  name: require('./package').name,

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
    const reexportsTree = mergeTrees(
      [
        'index',
        'extend',
        'macros',
        'adapters',
        '-private/better-errors',
        '-private/meta',
      ]
        .map((publicModuleName) =>
          writeFile(
            `/${this.moduleName()}/${publicModuleName}.js`,
            `export * from '${this.moduleName()}/test-support/${publicModuleName}';`
          )
        )
        .concat(
          [
            'adapter',
            'adapters/rfc268',
            '-private/action',
            '-private/deprecate',
          ].map((publicModuleName) =>
            writeFile(
              `/${this.moduleName()}/${publicModuleName}.js`,
              `export { default } from '${this.moduleName()}/test-support/${publicModuleName}';`
            )
          )
        )
    );

    return mergeTrees([
      testSupportTree,
      this.preprocessJs(reexportsTree, '/', this.name, {
        registry: this.registry,
      }),
    ]);
  },
};
