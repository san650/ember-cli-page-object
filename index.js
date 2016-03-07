/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-page-object',

  included: function(app) {
    this._super.included(app);

    if (app.env === 'test' || app.env === 'development') {
      app.import(app.bowerDirectory + '/ceibo/index.js');
    }
  }
};
