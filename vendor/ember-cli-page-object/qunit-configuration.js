/* globals $,QUnit,Ember*/

$(document).ready(function() {
  QUnit.config.urlConfig.push({ id: 'stopOnError', label: 'Page Object stop on error'});
  if (QUnit.urlParams.stopOnError) {
    Ember.onerror = function () {
      QUnit.stop();
      return false;
    };
  }
});
