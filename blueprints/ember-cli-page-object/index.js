/*jshint node:true*/
module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('ceibo', '1.1.0');
  }
};
