(function() {
  var jq = self['$'].noConflict();

  function vendorModule() {
    'use strict';

    return { 'default': jq };
  }

  define('-jquery', [], vendorModule);
})();
