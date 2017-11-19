// Define an amd module called "-jquery" 
// which exposes jQuery bundeled with ember-cli-page-object.
//
// This mode is used when we deal with `jquery`-less apps.
(function() {
  // prevent jquery provided by ember-cli-page-object
  // to be set to `Ember.$` by Ember. 
  var jq = self['$'].noConflict();
  delete self['jQuery'];

  function vendorModule() {
    'use strict';

    if (!jq) {
      throw new Error('Unable to find jQuery');
    }

    return { 'default': jq };
  }

  define('-jquery', [], vendorModule);
})();
