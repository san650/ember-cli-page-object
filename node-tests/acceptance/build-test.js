var assert = require('assert');
var fs = require('fs');
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe.skip('Acceptance: development build', function() {
  this.timeout(600000);

  var app;

  before(function() {
    if (process.env.SKIP_ACCEPTANCE === 'true') {
      this.skip();
      return;
    }

    app = new AddonTestApp();
  });

  it('generates a development build', function() {
    return app
      .create('dummy', {
        fixturesPath: 'node-tests/acceptance/fixtures'
      })
      .then(function() {
        return app.runEmberCommand('build', '-dev')
      })
      .then(assertFileExists(app, 'test.txt'))
  });

  it('generates a production build', function() {
    return app
      .create('dummy', {
        fixturesPath: 'node-tests/acceptance/fixtures'
      })
      .then(function() {
        return app.runEmberCommand('build', '-prod')
      })
      .then(assertFileExists(app, 'test.txt'))
  });
});

function assertFileExists(app, filePath) {
  return function() {
    assert.ok(fs.existsSync(app.filePath(filePath)), 'file exists')
  };
}
