 /*jshint -W079 */
/* jshint node: true */
/* jshint expr: true */
/* global describe, afterEach, it */
 
// Test borrowed from ember-cli-mirage

var expect = require('chai').expect;
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

function getAddon(options) {
  options = options || {};
  options['ember-cli-page-object'] = options['ember-cli-page-object'] || {};

  var dummyApp = new EmberAddon(options);

  return findAddon(dummyApp);
}

function findAddon(app) {
  var addons = app.project.addons;
  for(var i = 0; i < addons.length; i++) {
    if(addons[i].name === 'ember-cli-page-object') {
      return addons[i];
    }
  }
}

describe('Addon', function() {
  this.timeout(15000);

  afterEach(function() {
    delete process.env.EMBER_ENV;
  });

  var treeForTests = function(name) {
    it('returns an empty tree in production environment by default', function() {
      process.env.EMBER_ENV = 'production';
      var addonTree = getAddon().treeFor(name);

      expect(addonTree).to.be.undefined;
    });

    ['development', 'test'].forEach(function(environment) {
      it('returns a tree in ' + environment + ' environment by default', function() {
        process.env.EMBER_ENV = environment;
        var addonTree = getAddon().treeFor(name);

        expect(addonTree._inputNodes.length).to.not.equal(0);
      });
    });

    it('returns a tree in production environment when enabled is specified', function() {
      process.env.EMBER_ENV = 'production';
      var addon = getAddon({ configPath: 'tests/fixtures/config/environment-production-enabled' });
      var addonTree = addon.treeFor(name);

      expect(addonTree._inputNodes.length).to.not.equal(0);
    });
  };

  describe('#treeFor addon', function() {
    treeForTests('addon');
  });

  describe('#treeFor app', function() {
    treeForTests('app');
  });

});
