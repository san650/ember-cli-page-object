(function() {
  function vendorModule() {
    'use strict';

    var jq = self['$'].noConflict();
    return { 'default': jq };
  }

  define('-jquery', [], vendorModule);
})();
