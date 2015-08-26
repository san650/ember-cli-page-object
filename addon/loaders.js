/*global requirejs, require */
/*jslint node: true */

import Ember from 'ember';

export default Ember.Object.create({
  loadComponent: function(name) {
    let pageObjectComponentstRegExp = new RegExp(`^${this.prefix}/tests/pages/components/${name}$`),
      componentFilePath = Object.keys(requirejs._eak_seen).filter(function(key) {
        return pageObjectComponentstRegExp.test(key);
      })[0],
      component = require(componentFilePath, null, null, true);

    if (!component) {
      throw new Error(`${name} + ' doesn't exist.`);
    }

    return component['default'];
  }
});
