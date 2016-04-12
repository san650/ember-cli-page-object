/*jshint node:true*/
module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('ceibo', '1.1.0');
  },

  description: "Includes ember-cli-page-object's Bower dependencies into your project."
};
