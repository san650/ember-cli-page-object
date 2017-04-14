var assert = require('assert');
var RSVP = require('rsvp');
var fs = require('fs');
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('Acceptance: development build', function() {
  this.timeout(300000);

  var app;

  before(function() {
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
