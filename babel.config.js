const { buildEmberPlugins } = require('ember-cli-babel');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [[require.resolve('@babel/preset-env')]],
    plugins: [
      ...buildEmberPlugins(__dirname, {
        shouldIgnoreJQuery: true,
        // This is a bit unclear to me what it does.
        // The problem solved by this option is described here:
        // https://github.com/babel/ember-cli-babel/issues/398
        disableModuleResolution: true,
      }),
    ],
  };
};
