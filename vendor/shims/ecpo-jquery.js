// Define an amd module called "-jquery".
// It expects that we have already imported our own version of jQuery
// which is going to be used in ember-cli-page-oject internally.
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
