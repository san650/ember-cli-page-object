const { buildEmberPlugins } = require('ember-cli-babel');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [[require.resolve('@babel/preset-env')]],
    plugins: [
      ...buildEmberPlugins(__dirname, {
        shouldIgnoreJQuery: true,
      }),
    ],
  };
};
